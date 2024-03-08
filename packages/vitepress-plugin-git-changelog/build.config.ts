// Thanks to https://github.com/wobsoriano/vue-sfc-unbuild
// and all the discussions in https://github.com/unjs/unbuild/issues/80
// for the following configuration.

import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: './src',
      pattern: ['**/*.vue'],
      loaders: ['vue'],
    },
    {
      builder: 'mkdist',
      input: './src',
      pattern: ['**/*.ts'],
      format: 'cjs',
      loaders: ['js'],
    },
    {
      builder: 'mkdist',
      input: './src',
      pattern: ['**/*.ts'],
      format: 'esm',
      loaders: ['js'],
    },
  ],
  clean: true,
  sourcemap: true,
  declaration: true,
  externals: [
    'vite',
    'simple-git',
    'md5',
    // builtins
    ...builtins,
  ],
  rollup: {
    emitCJS: true,
  },
})
