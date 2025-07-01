import type { Plugin } from 'vite'

import type { Context, GitChangelogMarkdownSectionOptions } from './types'

import { relative } from 'node:path'

import GrayMatter from 'gray-matter'

import { createHelpers } from './helpers'

export type {
  Context,
  GitChangelogMarkdownSectionOptions,
}

export function GitChangelogMarkdownSection(options?: GitChangelogMarkdownSectionOptions): Plugin {
  const {
    excludes = ['index.md'],
    exclude = () => false,
  } = options ?? {}

  let root = ''

  return {
    name: '@nolebase/vitepress-plugin-git-changelog-markdown-section',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    configResolved(config) {
      root = config.root ?? ''
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

      if (!options?.sections?.disableContributors)
        code = TemplateContributors(code)
      if (!options?.sections?.disableChangelog)
        code = TemplateChangelog(code)

      return code
    },
  }
}

function TemplateContributors(code: string) {
  return `${code}

<NolebaseGitContributors />
`
}

function TemplateChangelog(code: string) {
  return `${code}

<NolebaseGitChangelog />
`
}
