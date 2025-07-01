import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import Yaml from '@rollup/plugin-yaml'
import builtins from 'builtin-modules'

import { defineBuildConfig } from 'unbuild'

const execAsync = promisify(exec)

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
    { builder: 'mkdist', input: './src/client', outDir: './dist/client', pattern: ['**/*.css'], loaders: ['postcss'] },
    { builder: 'mkdist', input: './src/types', outDir: './dist/types', loaders: ['js'] },
    { builder: 'rollup', input: './src/locales/index', outDir: './dist/locales' },
    { builder: 'rollup', input: './src/vite/index', outDir: './dist/vite' },
  ],
  clean: true,
  sourcemap: true,
  declaration: true,
  externals: [
    'vite',
    'uncrypto',
    // builtins
    ...builtins,
  ],
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'rollup:options': (_, options) => {
      if (Array.isArray(options.plugins))
        // TODO: incorrect type for Yaml
        options.plugins.push(Yaml() as any)
    },
    'mkdist:done': async (ctx) => {
      if (ctx.options.stub)
        return
      // Since not all the users would choose to use unocss,
      // we bundle the styles from unocss here for users to opt-in.
      //
      // However, since the unocss doesn't provide a unplugin, or rollup
      // plugin for us to use, we have to use the CLI here.
      //
      // The use of CLI was suggested by how to use unocss with rollup? · unocss/unocss · Discussion #542
      // https:// github.com/unocss/unocss/discussions/542
      await execAsync('unocss "./src/client/**/*.vue" -o dist/client/unocss.css')
    },
  },
})
