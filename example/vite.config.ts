import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    base: './',
    root: './example',
    plugins: [
        vue(),
    ],
    build: {
        outDir: path.resolve(__dirname, '../example_dist'),
        minify: false,
    },
    resolve: {
        alias: {
            '@public': path.resolve(__dirname, './public'),
        }
    },
    publicDir: path.resolve(__dirname, './public'),
})