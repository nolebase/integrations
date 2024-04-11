import { relative } from 'node:path'
import type { Plugin } from 'vite'
import GrayMatter from 'gray-matter'
import type { SiteConfig } from 'vitepress'

import type { Locale } from './locales'
import { defaultEnLocale } from './locales'
import { createHelpers } from './helpers'
import type { Context, GitChangelogMarkdownSectionOptions } from './types'
import { tTitles } from './i18n'

interface VitePressConfig {
  vitepress: SiteConfig
}

export type {
  GitChangelogMarkdownSectionOptions,
  Context,
  Locale,
}

export function GitChangelogMarkdownSection(options?: GitChangelogMarkdownSectionOptions): Plugin {
  const {
    excludes = ['index.md'],
    exclude = () => false,
  } = options ?? {}

  let root = ''
  let vitepressConfig: SiteConfig

  return {
    name: '@nolebase/vitepress-plugin-git-changelog-markdown-section',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    configResolved(config) {
      root = config.root ?? ''
      vitepressConfig = (config as unknown as VitePressConfig).vitepress
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      const helpers = createHelpers(root, id)

      if (excludes.includes(relative(root, id)))
        return null
      if (exclude(id, { helpers }))
        return null

      const parsedMarkdownContent = GrayMatter(code)

      if ('nolebase' in parsedMarkdownContent.data && 'gitChangelog' in parsedMarkdownContent.data.nolebase && !parsedMarkdownContent.data.nolebase.gitChangelog)
        return null
      if ('gitChangelog' in parsedMarkdownContent.data && !parsedMarkdownContent.data.gitChangelog)
        return null

      const { contributorsTitle, changelogTitle } = tTitles(vitepressConfig, options, code, id, helpers)
      if (!options?.sections?.disableContributors)
        code = TemplateContributors(code, contributorsTitle ?? defaultEnLocale!.gitChangelogMarkdownSectionTitles!.contributors!)
      if (!options?.sections?.disableChangelog)
        code = TemplateChangelog(code, changelogTitle ?? defaultEnLocale!.gitChangelogMarkdownSectionTitles!.changelog!)

      return code
    },
  }
}

function TemplateContributors(code: string, title: string) {
  return `${code}

## ${title}

<NolebaseGitContributors />
`
}

function TemplateChangelog(code: string, title: string) {
  return `${code}

## ${title}

<NolebaseGitChangelog />
`
}
