import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from 'node:process'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'

function getVueProdHydrationMismatchDetailsFlag() {
  if (!env) {
    console.warn('WARNING: env is not available when trying to get Vue Prod Hydration Mismatch Details Flag')
    throw new Error('env is not available')
  }

  return !!env.VUE_PROD_HYDRATION_MISMATCH_DETAILS_FLAG
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  assetsInclude: [
    '**/*.mov',
    '**/*.mp4',
    '**/*.riv',
  ],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: getVueProdHydrationMismatchDetailsFlag(),
  },
  resolve: {
    alias: {
      '@nolebase/ui': resolve(__dirname, '../packages/ui/src/'),
      '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
    },
  },
  plugins: [
    Inspect(),
    UnoCSS(),
    GitChangelog({
      maxGitLogCount: 2000,
      repoURL: () => 'https://github.com/nolebase/integrations',
      rewritePaths: {
        'docs/': '',
      },
    }),
    GitChangelogMarkdownSection({
      getChangelogTitle: (_, __, { helpers }): string => {
        if (helpers.idStartsWith(join('pages', 'en')))
          return 'File History'
        if (helpers.idStartsWith(join('pages', 'zh-CN')))
          return '文件历史'

        return 'File History'
      },
      getContributorsTitle: (_, __, { helpers }): string => {
        if (helpers.idStartsWith(join('pages', 'en')))
          return 'Contributors'
        if (helpers.idStartsWith(join('pages', 'zh-CN')))
          return '贡献者'

        return 'Contributors'
      },
      excludes: [],
      exclude: (_, { helpers }): boolean => {
        if (helpers.idEquals(join('pages', 'en', 'index.md')))
          return true
        if (helpers.idEquals(join('pages', 'zh-CN', 'index.md')))
          return true

        return false
      },
    }),
    PageProperties(),
    PagePropertiesMarkdownSection({
      excludes: [],
      exclude: (_, { helpers }): boolean => {
        if (helpers.idEquals(join('pages', 'en', 'index.md')))
          return true
        if (helpers.idEquals(join('pages', 'zh-CN', 'index.md')))
          return true

        return false
      },
    }),
  ],
})
