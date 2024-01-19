import { join } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    plugins: [
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
