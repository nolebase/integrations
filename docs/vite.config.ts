import { dirname, join } from 'node:path'
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
          docs: '',
        },
      }),
      GitChangelogMarkdownSection({
        getChangelogTitle: (_, id): string => {
          if (id.startsWith(join(ROOT, 'pages/en/')))
            return 'File History'
          if (id.startsWith(join(ROOT, 'pages/zh-CN/')))
            return '文件历史'

          return 'File History'
        },
        excludes: [],
        exclude: (id): boolean => {
          if (id === join(ROOT, 'pages/en/index.md'))
            return true
          if (id === join(ROOT, 'pages/zh-CN/index.md'))
            return true

          return false
        },
      }),
    ],
  }
})
