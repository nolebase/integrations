import type { Plugin } from 'vite'

import type { PresetVite, PresetViteOptions } from './types'

import { join } from 'node:path'

import defu from 'defu'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'

export function presetVite(options: PresetViteOptions): PresetVite {
  const opts = defu<PresetViteOptions, PresetViteOptions[]>(options, {
    gitChangelog: {
      options: {
        gitChangelog: {
          maxGitLogCount: 2000,
        },
        markdownSection: {
          excludes: [
            join('pages', 'en', 'index.md'),
            join('pages', 'zh-CN', 'index.md'),
            join('README.md'),
            join('index.md'),
          ],
        },
      },
    },
    pageProperties: {
      options: {
        markdownSection: {
          excludes: [
            join('pages', 'en', 'index.md'),
            join('pages', 'zh-CN', 'index.md'),
            join('README.md'),
            join('index.md'),
          ],
        },
      },
    },
    thumbnailHashImages: true as any,
  })

  const plugins: Plugin[] = []

  if (opts.gitChangelog) {
    plugins.push(GitChangelog(opts.gitChangelog.options.gitChangelog))
    plugins.push(GitChangelogMarkdownSection(opts.gitChangelog.options.markdownSection))
  }
  if (opts.pageProperties) {
    plugins.push(PageProperties())
    plugins.push(PagePropertiesMarkdownSection(opts.pageProperties.options?.markdownSection))
  }
  if (opts.thumbnailHashImages) {
    plugins.push(ThumbnailHashImages())
  }

  return {
    name: 'nolebase:vitepress',
    plugins: () => plugins || [],
    config: () => {
      return {
        optimizeDeps: {
          // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
          // This needs to be excluded from optimization
          exclude: [
            'vitepress',
            '@nolebase/ui',
            '@nolebase/ui-asciinema',
            '@nolebase/ui-rive-canvas',
            '@nolebase/vitepress-plugin-enhanced-mark',
            '@nolebase/vitepress-plugin-enhanced-readabilities',
            '@nolebase/vitepress-plugin-git-changelog',
            '@nolebase/vitepress-plugin-highlight-targeted-heading',
            '@nolebase/vitepress-plugin-index',
            '@nolebase/vitepress-plugin-inline-link-preview',
            '@nolebase/vitepress-plugin-page-properties',
            '@nolebase/vitepress-plugin-thumbnail-hash',
          ],
        },
        ssr: {
          noExternal: [
            '@nolebase/**',
          ],
        },
      }
    },
  }
}
