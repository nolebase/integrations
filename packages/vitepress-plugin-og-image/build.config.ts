import { copy } from 'fs-extra'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { builder: 'rollup', input: './src/vitepress/index', outDir: 'dist/vitepress/' },
  ],
  clean: true,
  sourcemap: true,
  declaration: true,
  externals: [
    'vite',
    'vitepress',
    'fs-extra',
    'glob',
    'emoji-regex',
    '@resvg/resvg-js',
    'gray-matter',
  ],
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'build:done': async () => {
      // copy all things under src/assets to dist/assets
      await copy('src/vitepress/assets', 'dist/vitepress/assets')
    },
  },
})
