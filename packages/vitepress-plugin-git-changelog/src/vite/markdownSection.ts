import { relative } from 'node:path'
import type { Plugin } from 'vite'
import { pathEndsWith, pathEquals, pathStartsWith } from './path'

export interface Context {
  helpers: {
    pathEquals: (path: string, equalsWith: string) => boolean
    pathStartsWith: (path: string, startsWith: string) => boolean
    pathEndsWith: (path: string, endsWith: string) => boolean
    idEquals: (equalsWith: string) => boolean
    idStartsWith: (startsWith: string) => boolean
    idEndsWith: (endsWith: string) => boolean
  }
}

export function GitChangelogMarkdownSection(options?: {
  getChangelogTitle?: (code: string, id: string, context: Context) => string
  getContributorsTitle?: (code: string, id: string, context: Context) => string
  excludes?: string[]
  exclude?: (id: string, context: Context) => boolean
  sections?: {
    disableChangelog?: boolean
    disableContributors?: boolean
  }
}): Plugin {
  const {
    getChangelogTitle = () => {
      return 'Changelog'
    },
    getContributorsTitle = () => {
      return 'Contributors'
    },
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
      function idEndsWith(endsWith) {
        return pathEndsWith(relative(root, id), endsWith)
      }

      function idEquals(equals) {
        return pathEquals(relative(root, id), equals)
      }

      function idStartsWith(startsWith) {
        return pathStartsWith(relative(root, id), startsWith)
      }

      if (!id.endsWith('.md'))
        return null
      if (excludes.includes(id))
        return null
      if (exclude(id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))
        return null

      if (!options?.sections?.disableContributors)
        // eslint-disable-next-line ts/no-use-before-define
        code = TemplateContributors(code, getContributorsTitle(code, id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))

      if (!options?.sections?.disableChangelog)
        // eslint-disable-next-line ts/no-use-before-define
        code = TemplateChangelog(code, getChangelogTitle(code, id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))

      return code
    },
  }
}

// eslint-disable-next-line antfu/top-level-function
const TemplateContributors = (code: string, title: string) => `${code}

## ${title}

<NolebaseGitContributors />
`

// eslint-disable-next-line antfu/top-level-function
const TemplateChangelog = (code: string, title: string) => `${code}

## ${title}

<NolebaseGitChangelog />
`
