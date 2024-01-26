import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

export default defineBuildConfig({
  entries: [
    'src/vite/index',
  ],
  clean: false,
  sourcemap: true,
  declaration: true,
  externals: [
    'vite',
    // builtins
    ...builtins,
  ],
  rollup: {
    emitCJS: true,
  },
})
