import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
  ],
  clean: true,
  sourcemap: true,
  declaration: true,
  externals: [
    'vite',
    'vitepress',
    'fs-extra',
    'fast-glob',
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
      const { copy } = await import('fs-extra')
      await copy('src/assets', 'dist/assets')
    },
  },
})
