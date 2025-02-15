import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'vue',
    'vitepress',
    'vite',
    'node:process',
  ],
})
