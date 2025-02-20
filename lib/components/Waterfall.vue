<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue'
import {useResizeObserver} from '../hooks/userResizeObserver'
import {useParallelTaskControl} from "../hooks/useParallelTaskControl";
import {debounce} from "../utils/debounce";

/*
  宽度固定，图片等比例缩放；使用JS获取每张图片宽度和高度，结合 `relative` 和 `absolute` 定位
  计算每个图片的位置 `top`，`left`，保证每张新的图片都追加在当前高度最小的那列末尾
*/
export interface Image {
  src: string // 图片地址
}

export interface ImagesItem {
  data: Image // 图片信息
  // 图片地址
  url: string
  // 图片位置信息
  position: {
    width: number // 图片宽度
    height: number // 图片高度
    top: number // 图片距离顶部的距离
    left: number // 图片距离左边的距离
  },
  // 图片在images中的索引
  index: number
}

export interface Props {
  images?: Image[] // 图片数组
  columnCount?: number // 要划分的列数
  columnGap?: number // 各列之间的间隙，单位 px
  rowGap?: number // 各行之间的间隙，单位 px
  width?: string | number // 瀑布流区域的总宽度，单位 px
  maxParallelTasks?: number // 最大并行任务数
  transitionClass?: string // 图片过渡类名
  observerDelay?: number // 监听元素变化的延迟时间，单位 ms
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  columnCount: 3,
  columnGap: 20,
  rowGap: 20,
  width: '100%',
  maxParallelTasks: 16,
  transitionClass: 'waterfall-transition',
  observerDelay: 50,
})

const waterfallRef = ref() // 瀑布流区域
const waterfallWidth = ref<number>() // 瀑布区域宽度
const imageWidth = ref<number>() // 图片宽度
const imagesProperty = ref<{ width: number; height: number; top: number; left: number }[]>([]) // 图片位置
const preColumnHeight = ref<number[]>(Array(props.columnCount).fill(0)) // 每列的高度
const flag = ref(0) // 同步标识
const loadedIndex = ref(0) // 已加载图片的索引
const taskControl = useParallelTaskControl(props.maxParallelTasks) // 并行任务控制
const loadedImages = ref<ImagesItem[]>([]) // 已加载的图片列表

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
      // todo 重新计算位置
      updateImagesPosition()
    },
    {
      deep: true, // 强制转成深层侦听器
    }
)

watch(props.images, () => {
  // 清空已有的任务
  taskControl.clearTasks()
  // 图片追加时，从已加载的图片索引后开始加载
  preloadImages(flag.value, loadedIndex.value + 1)
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
      ...getPosition(loadedImages.value[i].index, newHeight)
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

/**
 *  图片预加载
 *  symbol 标识
 *  preIndex 已加载的图片数量
 */

async function preloadImages(symbol: number, preIndex = 0) {
  // 计算每列的图片宽度
  imageWidth.value = ((waterfallWidth.value as number) - (props.columnCount + 1) * props.columnGap) / props.columnCount
  // 加载图片
  for (let i = preIndex; i < len.value; i++) {
    if (symbol === flag.value) {
      // 添加任务
      taskControl.addTask(async () => {
        await loadImage(props.images[i].src, i, symbol)
      })
    } else {
      return false
    }
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
    image.onload = function () {

      // 防止多次触发onload
      image.onload = null

      if (symbol !== flag.value) {
        resolve('noLoad')
        return
      }

      if (n > loadedIndex.value) {
        loadedIndex.value = n
      }

      // 图片加载完成时执行，此时可通过image.width和image.height获取到图片原始宽高
      const height = image.height / (image.width / (imageWidth.value as number))
      imagesProperty.value[loadedImages.value.length] = {
        // 存储图片宽高和位置信息
        width: imageWidth.value as number,
        height: height,
        ...getPosition(loadedImages.value.length, height)
      }
      loadedImages.value.push({
        data: props.images[n],
        url: props.images[n].src,
        position: imagesProperty.value[loadedImages.value.length],
        index: n,
        // ...getPosition(loadedImages.value.length, height)
      })
      resolve('load')
    }
  })
}


// 计算图片位置
function getPosition(i: number, height: number) {
  // 获取图片位置信息（top，left）
  if (i < props.columnCount) {
    preColumnHeight.value[i] = props.rowGap + height
    return {
      top: props.rowGap,
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
    preColumnHeight.value[index] = top + props.rowGap + height
    return {
      top: top + props.rowGap,
      left: ((imageWidth.value as number) + props.columnGap) * index + props.columnGap
    }
  }
}

defineExpose({
  // 更新瀑布流
  updateWaterfall,
  // 重新计算图片位置
  updateImagesPosition,
  height: height,
  // 已加载的图片列表
  loadedImages: loadedImages,
})

</script>

<template>
  <div
      ref="waterfallRef"
      class="wq-waterfall"
      :style="`width: ${totalWidth}; height: ${height}px;`"
  >
    <div
        :class="transitionClass"
        class="waterfall-image"
        :style="`width: ${property?.width || 0}px; height: ${property?.height || 0}px; top: ${property && property.top}px; left: ${property && property.left}px;`"
        v-for="(property, index) in imagesProperty"
        :key="index"
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

    .link-cursor {
      cursor: pointer;
    }
  }

  .waterfall-transition {
    transition: all 0.2s ease-in-out 0s;
  }

}
</style>