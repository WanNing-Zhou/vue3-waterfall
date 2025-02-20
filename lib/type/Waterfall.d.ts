import {ComponentPropsOptions, ComponentOptionsBase} from 'vue';

// 定义组件的 props 类型
interface WaterfallProps {
    images: { src: string }[];
    columnCount?: number // 要划分的列数
    columnGap?: number // 各列之间的间隙，单位 px
    rowGap?: number // 各行之间的间隙，单位 px
    width?: string | number // 瀑布流区域的总宽度，单位 px
    borderRadius?: number // 瀑布流区域和图片圆角，单位 px
    maxParallelTasks?: number // 最大并行任务数
}


// 定义组件的类型
declare const Waterfall: ComponentOptionsBase<
    WaterfallProps,
    'updateWaterfall',
    ComponentPropsOptions<WaterfallProps>
>;

export default Waterfall;
