import type { GitChangelogMarkdownSectionOptions, GitChangelogOptions } from '@nolebase/vitepress-plugin-git-changelog/vite/types'
import type { PagePropertiesMarkdownSectionOptions } from '@nolebase/vitepress-plugin-page-properties/vite'
import type { Plugin } from 'vite'

export interface PresetVite extends Plugin {
  plugins: () => Plugin[]
}

export interface PresetViteOptions {
  gitChangelog: false | {
    options: {
      gitChangelog: GitChangelogOptions
      markdownSection?: GitChangelogMarkdownSectionOptions
    }
  }
  pageProperties?: false | {
    options?: {
      markdownSection?: PagePropertiesMarkdownSectionOptions
    }
  }
  thumbnailHashImages?: false
}
