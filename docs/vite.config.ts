import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from 'node:process'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import Yaml from '@rollup/plugin-yaml'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'

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
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: getVueProdHydrationMismatchDetailsFlag(),
  },
  assetsInclude: [
    '**/*.mov',
    '**/*.mp4',
    '**/*.riv',
  ],
  optimizeDeps: {
    exclude: [
      'vitepress',
    ],
  },
  resolve: {
    alias: {
      '@nolebase/ui': resolve(__dirname, '../packages/ui/src/'),
      '@nolebase/unconfig-vitepress': resolve(__dirname, '../packages/unconfig-vitepress/src/'),
      '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
      '@nolebase/vitepress-plugin-enhanced-mark': resolve(__dirname, '../packages/vitepress-plugin-enhanced-mark/src/'),
      '@nolebase/vitepress-plugin-thumbnail-hash': resolve(__dirname, '../packages/vitepress-plugin-thumbnail-hash/src/'),
    },
  },
  plugins: [
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
      excludes: [
        join('pages', 'en', 'index.md'),
        join('pages', 'zh-CN', 'index.md'),
      ],
    }),
    PageProperties(),
    PagePropertiesMarkdownSection({
      excludes: [
        join('pages', 'en', 'index.md'),
        join('pages', 'zh-CN', 'index.md'),
      ],
    }),
    ThumbnailHashImages(),
    Inspect({
      build: true,
      outputDir: '.vite-inspect',
    }),
    UnoCSS(),
    Yaml() as Plugin,
  ],
})
