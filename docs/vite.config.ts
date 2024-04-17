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
    '**/*.cast',
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
      '@nolebase/vitepress-plugin-enhanced-readabilities': resolve(__dirname, '../packages/vitepress-plugin-enhanced-readabilities/src/'),
      '@nolebase/vitepress-plugin-highlight-targeted-heading': resolve(__dirname, '../packages/vitepress-plugin-highlight-targeted-heading/src/'),
      '@nolebase/vitepress-plugin-inline-link-preview': resolve(__dirname, '../packages/vitepress-plugin-inline-link-preview/src/'),
      '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
      '@nolebase/vitepress-plugin-page-properties': resolve(__dirname, '../packages/vitepress-plugin-page-properties/src/'),
      '@nolebase/vitepress-plugin-thumbnail-hash': resolve(__dirname, '../packages/vitepress-plugin-thumbnail-hash/src'),
    },
  },
  plugins: [
    Yaml() as Plugin,
    GitChangelog({
      maxGitLogCount: 2000,
      repoURL: () => 'https://github.com/nolebase/integrations',
      rewritePaths: {
        'docs/': '',
      },
    }),
    GitChangelogMarkdownSection({
      locales: {
        'zh-CN': {
          gitChangelogMarkdownSectionTitles: {
            changelog: '文件历史',
            contributors: '贡献者',
          },
        },
        'en': {
          gitChangelogMarkdownSectionTitles: {
            changelog: 'File History',
            contributors: 'Contributors',
          },
        },
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
  ],
})
