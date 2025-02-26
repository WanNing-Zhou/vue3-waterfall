import { ref, toValue, computed, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

export function useIntersectionObserver(
    target: Ref | Ref[] | HTMLElement | HTMLElement[],
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
) {

    let observer: IntersectionObserver | undefined

    const stopObservation = ref(false)

    // 目标元素计算逻辑保持相同
    const targets = computed(() => {
        const targetsValue = toValue(target)
        if (targetsValue) {
            if (Array.isArray(targetsValue)) {
                return targetsValue.map((el: any) => toValue(el)).filter((el: any) => el)
            }
            return [targetsValue]
        }
        return []
    })

    const cleanup = () => {
        if (observer) {
            observer.disconnect()
            observer = undefined
        }
    }

    const observeElements = () => {
        if (targets.value.length && !stopObservation.value) {
            observer = new IntersectionObserver(callback, options)
            targets.value.forEach(element => observer!.observe(element))
        }
    }

    // 监听逻辑保持一致
    watch(
        () => targets.value,
        () => {
            cleanup()
            observeElements()
        },
        { immediate: true, flush: 'post' }
    )


    const stop = () => {
        stopObservation.value = true
        cleanup()
    }

    const start = () => {
        stopObservation.value = false
        observeElements()
    }

    onBeforeUnmount(() => cleanup())

    return { stop, start }
}