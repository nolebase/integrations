// Thanks to https://github.com/wobsoriano/vue-sfc-unbuild
// and all the discussions in https://github.com/unjs/unbuild/issues/80
// for the following configuration.

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
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
  externals: [],
  rollup: {
    emitCJS: true,
  },
})