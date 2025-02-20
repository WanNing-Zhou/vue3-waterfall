import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({

            tsconfigPath: 'tsconfig.app.json',
            insertTypesEntry: true,
            copyDtsFiles: true,
            // 指定需要为哪些文件生成类型定义
            include: ['lib/**/*.vue', 'lib/**/*.ts']
        }),
        createStyleImportPlugin({
            resolves: [VantResolve()],
        }),
        cssInjectedByJsPlugin()
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/index.ts'), // 组件入口文件
            name: 'wq-waterfall-vue3',
            fileName: (format) => `waterfall.${format}.js`
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
