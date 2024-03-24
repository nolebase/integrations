import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

export default defineBuildConfig({
  entries: [
    // Thanks to https://github.com/wobsoriano/vue-sfc-unbuild
    // and https://github.com/jsonleex/demo-mkdist
    // and all the discussions in https://github.com/unjs/unbuild/issues/80
    // for the following configuration.

    // Thanks to una-ui https://github.com/una-ui/una-ui/blob/main/packages/nuxt/package.json
    // and the great examples of https://github.com/nuxt/module-builder/blob/5f34de12f934dd3c5f9b97bd919c4303736f2fc5/src/commands/build.ts#L41-L67
    // excellent explanation in unjs/unbuild https://github.com/unjs/unbuild/issues/182
    // for me to understand which entry points to use.

    { builder: 'mkdist', input: './src/client', outDir: './dist/client', pattern: ['**/*.vue'], loaders: ['vue'] },
    { builder: 'mkdist', input: './src/client', outDir: './dist/client', pattern: ['**/*.ts'], format: 'cjs', loaders: ['js'] },
    { builder: 'mkdist', input: './src/client', outDir: './dist/client', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'] },
    { builder: 'rollup', input: './src/vite/index', outDir: './dist/vite' },
    { builder: 'rollup', input: './src/vite/index', outDir: './dist/vite' },
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
