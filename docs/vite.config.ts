import { dirname, join, relative, sep } from 'node:path'
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
          if (id.startsWith(relative(ROOT, join('pages', 'en')).split(sep).join('/')))
            return 'File History'
          if (id.startsWith(relative(ROOT, join('pages', 'zh-CN')).split(sep).join('/')))
            return '文件历史'

          return 'File History'
        },
        excludes: [],
        exclude: (id): boolean => {
          if (id === join(ROOT, 'pages', 'en', 'index.md').split(sep).join('/'))
            return true
          if (id === join(ROOT, 'pages', 'zh-CN', 'index.md').split(sep).join('/'))
            return true

          return false
        },
      }),
    ],
  }
})
