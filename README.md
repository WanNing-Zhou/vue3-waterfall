# wq-waterfall-vue3

## 介绍

基于vue3的瀑布流组件

[组件演示](https://wanning-zhou.github.io/vue3-waterfall/): https://wanning-zhou.github.io/vue3-waterfall/

## 安装

npm
```bash
npm install wq-waterfall-vue3
```

yarn
```bash
yarn add wq-waterfall-vue3
```

pnpm
```bash
pnpm add wq-waterfall-vue3
```

## 使用

``` html
<template>
  <Waterfall :images="imageList">
    <template #item="{item}">
      <img style="width: 100%; height: 100%" :src="item.data.src"/>
    </template>
  </Waterfall>
</template>
<script setup lang="ts">
  import Waterfall from 'wq-waterfall-vue3'
  const imageList = ref([
    {src: '.....'},
    {src: '.....'}  
  ])
</script>
```

## 参数说明

props

| 参数               | 说明                   | 类型                         | 默认值                   |
|------------------|----------------------|----------------------------|-----------------------|
| `images`         | 图片列表                 | `Array<`[Image](#Image)`>` | `[]`                  |
| `columnCount`    | 列数                   | `number`                   | `3`                   |
| `rowGap`         | 各行之间的间隙，单位 px        | `number`                   | `20`                  |
| `columnGap`      | 各列之间的间隙，单位 px        | `number`                   | `20`                  |
| `width`          | 瀑布流区域的总宽度，单位 px      | `string \|  number`        | `100%`                |
| `maxParallelTasks` | 最大并行任务数              | `number`                   | `8`                   |
| `transitionClass` | 图片过渡类名               | `string`                   | `aterfall-transition` |
| `observerDelay`  | 监听瀑布流元素变化的延迟时间，单位 ms | `number`                   | `50`                  |
| `loadNum`        |每次加载图片数量|`number`| `8`                   |
| `showErrorImage` | 是否显示加载失败的图片 | `boolean` | `false`               |
| `errorImage`      | 加载失败的图片地址 | `string` | 默认加载错误图片              |
|`loadOverCallback`| 图片加载完毕的回调函数 | `()=>void` | `()=>{}`              |

> 最大并行任务数：当图片加载时，会开启多个任务，当任务数大于最大并行任务数时，会等待任务执行完毕后再开启新的任务，这样可以避免任务过多导致的卡顿
> 比如设置为16，当有17张图片加载时，会先加载16张图片，当这16张图片中的一张加载完毕后，会追加一个新的任务，以此类推，直到所有图片加载完毕

> loadNum：每次加载图片数量，当最后加载的图片进入可视区域时，会自动加载下一批图片，loadNum就是每次加载的图片数量


expose

| 参数            | 说明                   | 类型                                 |
| --------------- | ---------------------- |------------------------------------|
| `updateWaterfall`      | 更新瀑布流                 | `()=>void`                         | 
| `updateImagesPosition` | 重新计算图片位置                 | `()=>void`                         | 
 | `height`        | 瀑布流区域的总高度，单位 px      | `number`                           |
| `loadedImages`  | 已加载的图片列表                 | `Array<`[ImageItem](#ImageItem)`>` |


slot

| 名称   | 参数          | 说明                   | 类型                      |
|------| ------------- | ---------------------- |-------------------------|
| item | item   | 图片对象                 | [ImageItem](#ImageItem) |

## 类型说明

### Image

> 这里src是图片地址，里面也可以自定义其他属性，比如图片的id，图片的描述等等

```ts
export interface Image {
  src: string // 图片地址
}
```

### ImageItem

```ts
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
    // 图片是否加载完毕
    loaded: boolean
}
```

## 注意

>  当动态改变prop的 `width rowGap columnGap columnCount` 这些属性时，会自动重新计算瀑布流中图片的位置

> 当最大任务数不设置为1时，图片不是按照顺序渲染到瀑布流中，在任务队中先加载完的那张会优先渲染到瀑布流中， 当设置为1是图片会按照顺序渲染到瀑布流中

> 目前已经实现了类似图片的懒加载操作，当最后一批加载完成的图片进入可视区域时，会自动加载下一批图片

> 如果需要显示错误图片，需要设置 `showErrorImage` 为 `true`，并设置 `errorImage` 为错误图片的地址

> 当传入的所有图片加载完成后，会触发 `loadOverCallback` 回调函数

> Image数组可以从最后面追加图片，追加图片后，会自动更新瀑布流，不需要手动调用`updateWaterfall`方法  
> 如果从数组头部或中间添加数据，或者是删除Image数组的的数据，需要手动调用`updateWaterfall`方法，更新瀑布流  
> 调用`updateWaterfall` 会使图片从头开始重新加载，会导致Waterfall组件高度重新计算，如果父组件有滚动条，滚动条会回到顶部
