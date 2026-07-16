import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { builder: 'rollup', input: './src/index', outDir: './dist' },
    { builder: 'rollup', input: './src/vitepress/client/index', outDir: './dist/vitepress/client' },
    { builder: 'rollup', input: './src/vitepress/markdown-it/index', outDir: './dist/vitepress/markdown-it' },
    { builder: 'rollup', input: './src/vitepress/vite/index', outDir: './dist/vitepress/vite' },
    { builder: 'mkdist', input: './src/vitepress/client', outDir: './dist/vitepress/client', pattern: ['**/*.css'], loaders: ['postcss'] },
  ],
  externals: [
    'vue',
    'vitepress',
    'vite',
    'node:process',
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
