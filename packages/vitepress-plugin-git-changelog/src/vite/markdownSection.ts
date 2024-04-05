import { relative } from 'node:path'
import type { Plugin } from 'vite'
import GrayMatter from 'gray-matter'

import {
  pathEndsWith,
  pathEquals,
  pathStartsWith,
} from './path'

export interface Context {
  helpers: {
    /**
     * A helper function to help to determine whether the passed string parameter equals the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param equalsWith - String to equal with
     * @returns boolean
     */
    idEquals: (equalsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed string parameter startsWith the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param startsWith - String to start with
     * @returns boolean
     */
    idStartsWith: (startsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed string parameter endsWith the
     * current transforming module ID with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param endsWith - String to end with
     * @returns boolean
     */
    idEndsWith: (endsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * equals the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param path - Path to be compared with
     * @param equalsWith - String to equal with
     * @returns boolean
     */
    pathEquals: (path: string, equalsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * startsWith the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param path - Path to be compared with
     * @param startsWith - String to start with
     * @returns boolean
     */
    pathStartsWith: (path: string, startsWith: string) => boolean
    /**
     * A helper function to help to determine whether the passed first path parameter
     * endsWith the second passed string with normalization of paths capabilities and
     * cross platform / OS compatibilities.
     * @param path - Path to be compared with
     * @param endsWith - String to end with
     * @returns boolean
     */
    pathEndsWith: (path: string, endsWith: string) => boolean
  }
}

export interface GitChangelogMarkdownSectionOptions {
  /**
   * The getter function to get the title of the changelog section
   * @param code - raw markdown code (comes from vite when transform hook is called)
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns string
   * @default () => 'Changelog'
   */
  getChangelogTitle?: (code: string, id: string, context: Context) => string
  /**
   * The getter function to get the title of the contributors section
   * @param code - raw markdown code (comes from vite when transform hook is called)
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns string
   * @default () => 'Contributors'
   */
  getContributorsTitle?: (code: string, id: string, context: Context) => string
  /**
   * The list of file names to exclude from the transformation
   * @default ['index.md']
   */
  excludes?: string[]
  /**
   * The function to exclude the file from the transformation
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns boolean
   * @default () => false
   */
  exclude?: (id: string, context: Context) => boolean
  /**
   * The sections options
   */
  sections?: {
    /**
     * Whether to disable the changelog section
     */
    disableChangelog?: boolean
    /**
     * Whether to disable the contributors section
     */
    disableContributors?: boolean
  }
}

export function GitChangelogMarkdownSection(options?: GitChangelogMarkdownSectionOptions): Plugin {
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
      function idEndsWith(endsWith: string) {
        return pathEndsWith(relative(root, id), endsWith)
      }

      function idEquals(equals: string) {
        return pathEquals(relative(root, id), equals)
      }

      function idStartsWith(startsWith: string) {
        return pathStartsWith(relative(root, id), startsWith)
      }

      if (!id.endsWith('.md'))
        return null
      if (excludes.includes(relative(root, id)))
        return null
      if (exclude(id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))
        return null

      const parsedMarkdownContent = GrayMatter(code)
      if ('nolebase' in parsedMarkdownContent.data && 'gitChangelog' in parsedMarkdownContent.data.nolebase && !parsedMarkdownContent.data.nolebase.gitChangelog)
        return null
      if ('gitChangelog' in parsedMarkdownContent.data && !parsedMarkdownContent.data.gitChangelog)
        return null

      if (!options?.sections?.disableContributors)

        code = TemplateContributors(code, getContributorsTitle(code, id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))

      if (!options?.sections?.disableChangelog)

        code = TemplateChangelog(code, getChangelogTitle(code, id, { helpers: { pathStartsWith, pathEquals, pathEndsWith, idEndsWith, idEquals, idStartsWith } }))

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
