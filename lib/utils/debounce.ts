export function debounce(func: Function, delay: number) {
    let timer : number | null = null;
    return function(...args : any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}