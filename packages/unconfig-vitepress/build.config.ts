import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineBuildConfig({
  alias: {
    '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
    '@nolebase/vitepress-plugin-enhanced-img/client': resolve(__dirname, '../packages/vitepress-plugin-enhanced-img/src/client'),
  },
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
