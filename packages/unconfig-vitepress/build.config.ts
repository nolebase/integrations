import builtins from 'builtin-modules'

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/plugins/index.ts',
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
