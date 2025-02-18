<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useResizeObserver } from '../hooks/userResizeObserver'
import {useParallelTaskControl} from "../hooks/useParallelTaskControl";
import {debounce} from "../utils/debounce";
/*
  宽度固定，图片等比例缩放；使用JS获取每张图片宽度和高度，结合 `relative` 和 `absolute` 定位
  计算每个图片的位置 `top`，`left`，保证每张新的图片都追加在当前高度最小的那列末尾
*/
export interface Image {
  src: string // 图片地址
}

export interface Props {
  images?: Image[] // 图片数组
  columnCount?: number // 要划分的列数
  columnGap?: number // 各列之间的间隙，单位 px
  width?: string | number // 瀑布流区域的总宽度，单位 px
  borderRadius?: number // 瀑布流区域和图片圆角，单位 px
}
const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  columnCount: 3,
  columnGap: 20,
  width: '100%',
  borderRadius: 8,
  // backgroundColor: '#F2F4F8',
})

const waterfallRef = ref()
const waterfallWidth = ref<number>() // 瀑布区域宽度
const imageWidth = ref<number>() // 图片宽度
const imagesProperty = ref<{ width: number; height: number; top: number; left: number }[]>([]) // 图片位置
const preColumnHeight = ref<number[]>(Array(props.columnCount).fill(0)) // 每列的高度
const flag = ref(0) // 同步标识
const loadedIndex = ref(0) // 已加载图片的索引
const taskControl = useParallelTaskControl(16)
const loadedImages = ref<any[]>([]) // 已加载的图片索引列表

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
  return Math.max(...preColumnHeight.value) + props.columnGap
})

// 图片数量
const len = computed(() => {
  return props.images.length
})

watch(
    // () => [props.images, props.columnCount, props.columnGap, props.width],
    () => [ props.columnCount, props.columnGap, props.width],
    () => {
      waterfallWidth.value = waterfallRef.value.offsetWidth
      preColumnHeight.value = Array(props.columnCount).fill(0 )
      flag.value++
    },
    {
      deep: true, // 强制转成深层侦听器
      flush: 'post' // 在侦听器回调中访问被 Vue 更新之后的 DOM
    }
)

// 当图片追加时，从已加载的图片索引开始加载
watch(props.images, () => {
  flag.value++
  preloadImages(flag.value, loadedIndex.value)
  console.log('images', props.images.length, 'loadedIndex', loadedIndex.value )
  console.log('loadedImages', loadedImages.value.length)
},{
  deep: true,
  // flush: 'post'
})


onMounted(() => {
  waterfallWidth.value = waterfallRef.value.offsetWidth
  preloadImages(flag.value)
})

watch(flag, () => {
  console.log('flag', flag.value)
})


// 更新瀑布流
function updateWaterfall() {
  const currentWidth = waterfallRef.value.offsetWidth
  // 窗口宽度改变时重新计算瀑布流布局
  if (props.images.length && currentWidth !== waterfallWidth.value) {

    // 清空图片位置
    imagesProperty.value = []
    waterfallWidth.value = currentWidth
    taskControl.clearTasks()
    waterfallWidth.value = waterfallRef.value.offsetWidth
    preColumnHeight.value = Array(props.columnCount).fill(0 )
    loadedImages.value = []
    flag.value++
    preloadImages(flag.value)
  }
}

useResizeObserver(waterfallRef, debounce(updateWaterfall, 50))

/**
 *  图片预加载
 *  symbol 标识
 *  preIndex 已加载的图片数量
 */

async function preloadImages(symbol: number, preIndex = 0) {
  // console.log('symbol', symbol, 'flag', flag.value, symbol===flag.value, 'len',len.value)
  // 计算每列的图片宽度
  imageWidth.value = ((waterfallWidth.value as number) - (props.columnCount + 1) * props.columnGap) / props.columnCount
  // 加载图片
  for (let i = preIndex; i < len.value; i++) {
    console.log('preloadImages', i, 'symbol', symbol, 'flag', flag.value)
    if (symbol === flag.value) {
      // console.log('图片加载', i)
      // 添加任务
      taskControl.addTask(async ()=>{
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
      return
    }
    const image = new Image()
    image.src = url
    if(n > loadedIndex.value){
      loadedIndex.value = n
    }
    image.onload = function () {
      console.log('loadImage','symbol:', symbol, 'flag:', flag.value, 'imageProperty',imagesProperty.value.length)

      if (symbol !== flag.value) {
        resolve('noLoad')
        return
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
  // console.log('getPosition', i, height)
  // 获取图片位置信息（top，left）
  if (i < props.columnCount) {
    preColumnHeight.value[i] = props.columnGap + height
    return {
      top: props.columnGap,
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
    preColumnHeight.value[index] = top + props.columnGap + height
    return {
      top: top + props.columnGap,
      left: ((imageWidth.value as number) + props.columnGap) * index + props.columnGap
    }
  }
}

</script>

<template>
  <div
      ref="waterfallRef"
      class="m-waterfall"
      :style="`--border-radius: ${borderRadius}px; width: ${totalWidth}; height: ${height}px;`"
  >
<!--    <div-->
<!--        class="waterfall-image"-->
<!--        :style="`width: ${property?.width || 0}px; height: ${property?.height || 0}px; top: ${property && property.top}px; left: ${property && property.left}px;`"-->
<!--        v-for="(property, index) in imagesProperty"-->
<!--        :key="index"-->
<!--    >-->
<!--      <slot name="item" :item=" images[index]">-->
<!--      </slot>-->
<!--    </div>  -->
    <div
        class="waterfall-image"
        :style="`width: ${property?.width || 0}px; height: ${property?.height || 0}px; top: ${property && property.top}px; left: ${property && property.left}px;`"
        v-for="(property, index) in imagesProperty"
        :key="index"
    >
      <slot name="item" :item=" loadedImages[index]">
      </slot>
    </div>
  </div>
</template>
<style lang="less" scoped>
.m-waterfall {
  position: relative;
  border-radius: var(--border-radius);
  .waterfall-image {
    position: absolute;
    .image-link {
      display: block;
      height: 100%;
      cursor: default;
      .image-item {
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius);
        display: inline-block;
        vertical-align: bottom;
      }
    }
    .link-cursor {
      cursor: pointer;
    }
  }
}
</style>