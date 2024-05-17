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
  ],
  rollup: {
    emitCJS: true,
  },
})
