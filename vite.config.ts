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
            tsconfigPath: 'tsconfig.app.json', // 指定生成类型定义文件的 tsconfig.json 文件路径
            // insertTypesEntry: true, // 自动生成类型定义文件的入口文件
            copyDtsFiles: true, // 复制类型定义文件到输出目录
            include: ['lib/components/**/*.vue','lib/components/**/*.ts','lib/index.ts'], // 包含的文件路径
            // 生成类型定义的输出目录
            outDir: 'dist/types', // 指定生成类型定义文件的输出目录
            // cleanVueFileName: true, // 清理 Vue 文件名中的 .vue 后缀
            staticImport: true, // 使用静态导入方式引入类型定义文件
            // rollupTypes: true, // 使用 Rollup 打包类型定义文件
        }),
        createStyleImportPlugin({
            resolves: [VantResolve()],
        }),
        cssInjectedByJsPlugin()
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, './lib/index.ts'), // 组件入口文件
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
