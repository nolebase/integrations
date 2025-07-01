import type { Plugin } from 'vite'

import { dirname, join, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'

import Yaml from '@rollup/plugin-yaml'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import VueDevTools from 'vite-plugin-vue-devtools'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'
import { defineConfig } from 'vite'

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
      '~/packages': resolve(__dirname, '../packages'),
      '@nolebase/ui': resolve(__dirname, '../packages/ui/src/'),
      '@nolebase/ui-asciinema': resolve(__dirname, '../packages/ui-asciinema/src/'),
      '@nolebase/ui-rive-canvas': resolve(__dirname, '../packages/ui-rive-canvas/src/'),
      '@nolebase/unconfig-vitepress': resolve(__dirname, '../packages/unconfig-vitepress/src/'),
      '@nolebase/vitepress-plugin-enhanced-readabilities': resolve(__dirname, '../packages/vitepress-plugin-enhanced-readabilities/src/'),
      '@nolebase/vitepress-plugin-highlight-targeted-heading': resolve(__dirname, '../packages/vitepress-plugin-highlight-targeted-heading/src/'),
      '@nolebase/vitepress-plugin-index': resolve(__dirname, '../packages/vitepress-plugin-index/src/'),
      '@nolebase/vitepress-plugin-inline-link-preview': resolve(__dirname, '../packages/vitepress-plugin-inline-link-preview/src/'),
      '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
      '@nolebase/vitepress-plugin-graph-view': resolve(__dirname, '../packages/vitepress-plugin-graph-view/src/'),
      '@nolebase/vitepress-plugin-page-properties': resolve(__dirname, '../packages/vitepress-plugin-page-properties/src/'),
      '@nolebase/vitepress-plugin-thumbnail-hash': resolve(__dirname, '../packages/vitepress-plugin-thumbnail-hash/src'),
    },
  },
  plugins: [
    Yaml() as Plugin,
    VueDevTools() as Plugin,
    GitChangelog({
      maxGitLogCount: 2000,
      repoURL: () => 'https://github.com/nolebase/integrations',
      mapAuthors: [
        {
          name: 'Neko',
          username: 'nekomeowww',
          mapByNameAliases: ['Neko Ayaka', 'Ayaka Neko'],
          mapByEmailAliases: ['neko@ayaka.moe'],
        },
        {
          name: 'Rizumu',
          username: 'LittleSound',
          mapByNameAliases: ['Rizumu Ayaka', 'Ayaka Rizumu'],
          mapByEmailAliases: ['rizumu@ayaka.moe'],
        },
        {
          name: 'Nisekoi5',
          username: 'Nisekoi5',
        },
        {
          name: 'Northword',
          username: 'northword',
        },
      ],
    }),
    GitChangelogMarkdownSection({
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
