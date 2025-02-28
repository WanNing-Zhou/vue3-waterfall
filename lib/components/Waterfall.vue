<script setup lang="ts">
import {ref, computed, onMounted, watch, reactive} from 'vue'
import {useResizeObserver} from '../hooks/userResizeObserver'
import {useParallelTaskControl} from "../hooks/useParallelTaskControl";
import {debounce} from "../utils/debounce";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver.ts";
import type {ImagesItem, Props} from "./WaterfallType.ts";
import loadErrorImage from './loadError.png';

/*
  宽度固定，图片等比例缩放；使用JS获取每张图片宽度和高度，结合 `relative` 和 `absolute` 定位
  计算每个图片的位置 `top`，`left`，保证每张新的图片都追加在当前高度最小的那列末尾
*/

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  columnCount: 3,
  columnGap: 20,
  rowGap: 20,
  width: '100%',
  maxParallelTasks: 8,
  transitionClass: 'waterfall-transition',
  observerDelay: 50,
  loadNum: 8,
  showErrorImage: false,
  errorImage: loadErrorImage,
  loadOverCallback: () => {},
})

const waterfallRef = ref() // 瀑布流区域
const imgRef = ref() // 图片区域
const waterfallWidth = ref<number>() // 瀑布区域宽度
const imageWidth = ref<number>() // 图片宽度
const imagesProperty = ref<{ width: number; height: number; top: number; left: number }[]>([]) // 图片位置
const preColumnHeight = ref<number[]>(Array(props.columnCount).fill(0)) // 每列的高度
const flag = ref(0) // 同步标识
const loadedIndex = ref(0) // 已加载图片的索引
const taskControl = useParallelTaskControl(props.maxParallelTasks) // 并行任务控制
const loadedImages = ref<ImagesItem[]>([]) // 已加载的图片列表
const maxVisibleIndex = ref(-1) // 可视区域存在图片的最大索引
const errorImageData = reactive({
  src: '',
  width: 0,
  height: 0
})

// 监听errorImage，变化时重新获取错误图片的宽高
watch(() => [props.errorImage,props.showErrorImage], () => {
  if(props.showErrorImage){
    errorImageData.src = props.errorImage
    const image = new Image()
    image.src = props.errorImage
    image.onload = () => {
      // 防止多次触发onload
      image.onload = null
      errorImageData.width = image.width
      errorImageData.height = image.height
    }
  }
}, {
  deep: true,
  immediate: true
})

// 瀑布流宽度
const totalWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  } else {
    return props.width
  }
})

// 高度
const height = computed(() => {
  return Math.max(...preColumnHeight.value) + props.rowGap
})

// 图片数量
const len = computed(() => {
  return props.images.length
})

watch(
    () => [props.columnCount, props.columnGap, props.width, props.rowGap],
    () => {
      waterfallWidth.value = waterfallRef.value.offsetWidth
      // 重新计算位置
      updateImagesPosition()
    },
    {
      deep: true, // 强制转成深层侦听器
      flush: "post"
    }
)

watch(len, (_, oldValue) => {
  // 图片追加时, 判断图片是否已将加载完成，加载完成就加载下一批图片
  if (maxVisibleIndex.value >= oldValue - props.loadNum) {
    preloadImages(flag.value, loadedIndex.value)
  }
}, {
  deep: true,
})

onMounted(() => {
  waterfallWidth.value = waterfallRef.value.offsetWidth
  preloadImages(flag.value)
})

// 重新计算图片位置
function updateImagesPosition() {
  // 计算每列的图片宽度
  waterfallWidth.value = waterfallRef.value.offsetWidth
  imageWidth.value = ((waterfallWidth.value as number) - (props.columnCount + 1) * props.columnGap) / props.columnCount
  preColumnHeight.value = Array(props.columnCount).fill(0)
  // 清空图片位置
  imagesProperty.value = []
  // 重新计算图片位置
  for (let i = 0; i < loadedImages.value.length; i++) {
    // 重新计算每张图片的高度
    const {width: preWidth, height: preHeight} = loadedImages.value[i].position
    const newHeight = preHeight / (preWidth / (imageWidth.value as number))
    imagesProperty.value[i] = {
      // 存储图片宽高和位置信息
      width: imageWidth.value,
      height: newHeight,
      ...getPosition(i, newHeight)
    }
    loadedImages.value[i].position = imagesProperty.value[i]
  }
}

// 更新瀑布流
function updateWaterfall() {
  const currentWidth = waterfallRef.value.offsetWidth
  // 清空图片位置
  imagesProperty.value = []
  waterfallWidth.value = currentWidth
  taskControl.clearTasks()
  waterfallWidth.value = waterfallRef.value.offsetWidth
  preColumnHeight.value = Array(props.columnCount).fill(height.value)
  loadedImages.value = []
  flag.value++
  preloadImages(flag.value)
}

useResizeObserver(waterfallRef, () => {
  const currentWidth = waterfallRef.value.offsetWidth
  if (props.images.length && currentWidth !== waterfallWidth.value) {
    debounce(updateImagesPosition, props.observerDelay)()
  }
})

useIntersectionObserver(imgRef, (entries) => {
  let loadFlag = false

  const showIndexArray: number[] = []
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const imgIndex = Number(entry.target.getAttribute('index') || '-1')
      showIndexArray.push(imgIndex)
      if (imgIndex > loadedIndex.value - props.loadNum) {
        loadFlag = true
      }
    }
  })

  if (showIndexArray.length > 0) {
    // 计算可视区域存在图片的最大索引
    maxVisibleIndex.value = Math.max(...showIndexArray)
  }

  if (loadFlag && loadedIndex.value != len.value) {
    // 加载下一批图片
    preloadImages(flag.value, loadedIndex.value)
  }
})

/**
 *  图片预加载
 *  symbol 标识
 *  preIndex 已加载的图片数量
 */
async function preloadImages(symbol: number, startIndex = 0) {
  // 计算每列的图片宽度
  imageWidth.value = ((waterfallWidth.value as number) - (props.columnCount + 1) * props.columnGap) / props.columnCount
  // 计算结束索引
  const endIndex = (startIndex + props.loadNum) > len.value ? len.value : (startIndex + props.loadNum)
  // 加载图片
  for (let i = startIndex; i < endIndex; i++) {
    if (symbol === flag.value) {
      // 添加任务
      taskControl.addTask(async () => {
        await loadImage(props.images[i].src, i, symbol)
      })
    } else {
      return false
    }
  }
  loadedIndex.value = endIndex
  if (loadedIndex.value === len.value) {
    props.loadOverCallback()
  }
}


/**
 *  加载图片
 * @param url 图片地址
 * @param n   图片索引
 * @param symbol 标识
 */
function loadImage(url: string, n: number, symbol: number) {
  return new Promise((resolve) => {
    if (symbol !== flag.value) {
      resolve('symbolChange')
    }
    const image = new Image()
    image.src = url
    // 图片加载完成回调
    image.onload = function () {
      // 防止多次触发onload
      image.onload = null
      if (symbol !== flag.value) {
        resolve('noLoad')
        return
      }
      // 图片加载完成时执行，此时可通过image.width和image.height获取到图片原始宽高
      const height = image.height / (image.width / (imageWidth.value as number))
      imagesProperty.value[loadedImages.value.length] = {
        width: imageWidth.value as number,
        height: height, ...getPosition(loadedImages.value.length, height)
      }
      loadedImages.value.push({
        data: props.images[n],
        url: props.images[n].src,
        loaded: true,
        position: imagesProperty.value[loadedImages.value.length],
        index: n,
      })
      resolve('load')
    }

    // 图片加载失败回调
    image.onerror = function () {
      image.onerror = null
      if (symbol !== flag.value) {
        resolve('noLoad')
        return
      }
      let height = errorImageData.height / (errorImageData.width / (imageWidth.value as number))
      // 不显示错误图片
      if (!props.showErrorImage){
        height = 0
      }

      imagesProperty.value[loadedImages.value.length] = {
        width: imageWidth.value as number,
        height: height, ...getPosition(loadedImages.value.length, height)
      }
      loadedImages.value.push({
        data: props.images[n],
        url: props.errorImage,
        loaded: false,
        position: imagesProperty.value[loadedImages.value.length],
        index: n,
      })
      resolve('error')
    }
  })
}


// 计算图片位置
function getPosition(i: number, height: number) {
  if (Number.isNaN(height)) {
    height = 0
  }

  // 获取图片位置信息（top，left）
  if (i < props.columnCount) {
    preColumnHeight.value[i] = height ? (props.rowGap + height) : height
    return {
      top: height ? props.rowGap : 0,
      left: ((imageWidth.value as number) + props.columnGap) * i + props.columnGap
    }
  } else {
    const top = Math.min(...preColumnHeight.value)
    let index = 0
    for (let n = 0; n < props.columnCount; n++) {
      if (preColumnHeight.value[n] === top) {
        index = n
        break
      }
    }
    preColumnHeight.value[index] = top + (height ? (props.rowGap + height) : height)
    return {
      top: top + (height ? props.rowGap : 0),
      left: ((imageWidth.value as number) + props.columnGap) * index + props.columnGap
    }
  }
}

defineOptions({
  name: 'Waterfall',
})

defineExpose({
  // 更新瀑布流
  updateWaterfall,
  // 重新计算图片位置
  updateImagesPosition,
  // 瀑布流区域高度
  height: height,
  // 已加载的图片列表
  loadedImages: loadedImages,
  // 加载完成图片索引
  loadedIndex: loadedIndex.value - 1,
})

</script>

<template>
  <div
      ref="waterfallRef"
      class="wq-waterfall"
      :style="`width: ${totalWidth}; height: ${height}px;`"
  >
    <div
        ref="imgRef"
        :class="transitionClass"
        class="waterfall-image"
        v-for="(property, index) in imagesProperty"
        :style="`opacity:${(!loadedImages[index].loaded && !showErrorImage)?0:1}; width: ${property?.width || 0}px; height: ${property?.height || 0}px; top: ${property && property.top}px; left: ${property && property.left}px;`"
        :key="index"
        :index="loadedImages[index].index"
    >
      <slot name="item" :item="loadedImages[index]">
        <img :src="loadedImages[index].url" alt="" class="image-item"/>
      </slot>
    </div>
  </div>
</template>
<style lang="less" scoped>
.wq-waterfall {
  position: relative;

  .waterfall-image {
    position: absolute;

    .image-item {
      width: 100%;
      height: 100%;
      display: inline-block;
      vertical-align: bottom;
    }
  }

  .waterfall-transition {
    transition: all 0.2s ease-in-out 0s;
  }

}
</style>