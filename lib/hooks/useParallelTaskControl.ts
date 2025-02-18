import {ref, computed, watch} from 'vue';

/**
 *  并行任务控制的自定义钩子
 * @param maxParallel 最大并行任务数量
 */
export function useParallelTaskControl(maxParallel=8) {
    // 存储待执行的任务数组
    const tasks = ref<Function[]>([]);
    // 当前正在执行的任务数量
    const activeTasks = ref(0);
    // 当前要执行的任务的索引
    const taskIndex = ref(0);

    // 执行单个任务的
    const runTask = async () => {
        if (taskIndex.value < tasks.value.length) {
            activeTasks.value++;
            taskIndex.value++;
            const currentTask = tasks.value[taskIndex.value-1];
            try {
                await currentTask();
            } catch (error) {
                console.error('Task error:', error);
            } finally {
                activeTasks.value--;

                // 任务完成后，检查是否还有任务需要执行
                await runTask();
            }
        }
    };

    // 监听任务数组和正在执行任务数量的变化
    watch(() => [activeTasks,tasks],async () =>{
        if (activeTasks.value < maxParallel && taskIndex.value < tasks.value.length-1) {
            console.log('runTask')
            await runTask();
        }
    },{
        deep: true
    })

    // 添加任务的函数
    const addTask = (task: Function) => {
        tasks.value.push(task);
    };

    // 清空任务的函数
    const clearTasks = () => {
        tasks.value = [];
        taskIndex.value = 0;
        activeTasks.value = 0;
    };

    return {
        // 添加任务
        addTask,
        // 清空任务
        clearTasks,
        // 正在执行的任务数量
        activeTasks,
        // 剩余任务数量
        remainingTasks: computed(() => tasks.value.length - taskIndex.value)
    };
}