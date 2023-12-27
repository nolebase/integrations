import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    plugins: [
      UnoCSS(),
      GitChangelogMarkdownSection({
        getChangelogTitle: (_, id): string => {
          if (id.startsWith(join(__dirname, 'pages/en/')))
            return 'File History'
          if (id.startsWith(join(__dirname, 'pages/zh-CN/')))
            return '文件历史'

          return 'File History'
        },
        excludes: [],
        exclude: (id): boolean => {
          if (id === join(__dirname, 'pages/en/index.md'))
            return true
          if (id === join(__dirname, 'pages/zh-CN/index.md'))
            return true

          return false
        },
      }),
      GitChangelog({
        repoURL: () => 'https://github.com/nolebase/integrations',
        rewritePaths: {
          docs: '',
        },
      }),
    ],
  }
})
