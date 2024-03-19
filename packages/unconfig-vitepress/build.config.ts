import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
  ],
  clean: true,
  sourcemap: true,
  declaration: true,
  externals: [
    'vue',
    'vitepress',
    // builtins
    ...builtins,
  ],
  rollup: {
    emitCJS: true,
  },
})
