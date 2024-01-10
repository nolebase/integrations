import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'

const ROOT = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    plugins: [
      UnoCSS(),
      GitChangelog({
        repoURL: () => 'https://github.com/nolebase/integrations',
        rewritePaths: {
          [`docs${sep}`]: '',
        },
      }),
      GitChangelogMarkdownSection({
        getChangelogTitle: (_, id): string => {
          // eslint-disable-next-line no-console
          console.log(id, join(ROOT, 'pages', 'en'))
          // eslint-disable-next-line no-console
          console.log(id, join(ROOT, 'pages', 'zh-CN'))

          if (id.startsWith(join(ROOT, 'pages', 'en')))
            return 'File History'
          if (id.startsWith(join(ROOT, 'pages', 'zh-CN')))
            return '文件历史'

          return 'File History'
        },
        excludes: [],
        exclude: (id): boolean => {
          // eslint-disable-next-line no-console
          console.log(id, join(ROOT, 'pages', 'en', 'index.md'))
          // eslint-disable-next-line no-console
          console.log(id, join(ROOT, 'pages', 'zh-CN', 'index.md'))

          if (id === join(ROOT, 'pages', 'en', 'index.md'))
            return true
          if (id === join(ROOT, 'pages', 'zh-CN', 'index.md'))
            return true

          return false
        },
      }),
    ],
  }
})
