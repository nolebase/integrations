import { join } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    plugins: [
      Inspect(),
      UnoCSS(),
      GitChangelog({
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
  }
})
