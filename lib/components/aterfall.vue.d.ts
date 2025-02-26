// import {
//     DefineComponent,
//     ComputedRef,
//     Ref
// } from 'vue'
//
// export interface Image {
//     src: string // 图片地址
// }
//
// export interface ImagesItem {
//     data: Image // 图片信息
//     // 图片地址
//     url: string
//     // 图片位置信息
//     position: {
//         width: number // 图片宽度
//         height: number // 图片高度
//         top: number // 图片距离顶部的距离
//         left: number // 图片距离左边的距离
//     },
//     // 图片在images中的索引
//     index: number
//     loaded: boolean // 图片是否加载完成
// }
//
// export interface Props {
//     images?: Image[] // 图片数组
//     columnCount?: number // 要划分的列数
//     columnGap?: number // 各列之间的间隙，单位 px
//     rowGap?: number // 各行之间的间隙，单位 px
//     width?: string | number // 瀑布流区域的总宽度，单位 px
//     maxParallelTasks?: number // 最大并行任务数
//     transitionClass?: string // 图片过渡类名
//     observerDelay?: number // 监听元素变化的延迟时间，单位 ms
//     loadNum?: number // 每次加载的图片数量
//     showErrorImage?: boolean // 是否显示错误图片
//     errorImage?: string // 图片加载失败时的图片地址
//     loadOverCallback?: () => void // 图片加载完成的回调函数
// }
//
// declare const Waterfall: DefineComponent<
//     Props, // props 类型
//
//
//
//     {
//     // Props 类型 (核心配置)
//     props: Props
//
//     // 暴露的实例类型 (对应defineExpose)
//     exposed: {
//         // 更新瀑布流
//         updateWaterfall: () => void
//         // 更新图片位置
//         updateImagesPosition: () => void
//         // 获取瀑布流高度
//         height: ComputedRef<number>
//         // 已加载组件数组
//         loadedImages: Ref<ImagesItem[]>
//         // 加载组件索引
//         loadedIndex: number
//     }
//
//     // 插槽类型 (作用域插槽)
//     slots: {
//         item: { item: ImagesItem }
//     }
//
//     // 模板引用类型 (对应ref属性)
//     $refs: {
//         waterfallRef: HTMLDivElement
//         imgRef: HTMLDivElement[]
//     }
//
//     // 组件配置继承
//     mixins: [ComponentOptionsMixin]
// }>
//
// export default Waterfall