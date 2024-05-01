import { cwd } from 'node:process'
import type { Plugin } from 'vite'
import ora from 'ora'
import { cyan, gray } from 'colorette'
import { globby } from 'globby'
import { execa } from 'execa'

import type { Changelog, Commit } from '../types'
import {
  type CommitToStringHandler,
  type CommitToStringsHandler,
  type RewritePathsBy,
  defaultCommitURLHandler,
  defaultReleaseTagURLHandler,
  defaultReleaseTagsURLHandler,
  getCommits,
  rewritePathsByRewritingExtension,
} from './helpers'

export type {
  CommitToStringHandler,
  RewritePathsBy,
}

export {
  rewritePathsByRewritingExtension,
}

const VirtualModuleID = 'virtual:nolebase-git-changelog'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

const logModulePrefix = `${cyan(`@nolebase/vitepress-plugin-git-changelog`)}${gray(':')}`

export interface GitChangelogOptions {
  /**
   * The directory where your markdown pages are stored, relative to project root
   *
   * @default `''`
   *
   * @see https://vitepress.dev/reference/site-config#srcdir
   */
  srcDir?: string
  /**
   * When fetching git logs, what directories should be included?
   */
  includeDirs?: string[]
  /**
   * When fetching git logs, what extensions should be included?
   */
  includeExtensions?: `.${string}`[]
  /**
   * Your repository URL.
   * Yes, you can dynamically generate it.
   *
   * @default 'https://github.com/example/example'
   */
  repoURL?: string | CommitToStringHandler
  /**
   * A function to get the release tag URL.
   *
   * @default (commit) => `${commit.repo_url}/releases/tag/${commit.tag}`
   */
  getReleaseTagURL?: CommitToStringHandler
  /**
   * A function to get the release tags URL.
   *
   * @default (commit) => commit.tags?.map(tag => `${commit.repo_url}/releases/tag/${tag}`)
   */
  getReleaseTagsURL?: CommitToStringsHandler
  /**
   * A function to get the commit URL.
   *
   * @default (commit) => `${commit.repo_url}/commit/${commit.hash}`
   */
  getCommitURL?: CommitToStringHandler
  /**
   * A map that contains rewrite rules of paths.
   *
   * This is quite useful when you have your pages in a different directory than the base url after deployed since the
   * data will be calculated again on the client side.
   *
   * For example:
   *  - We have a page at `docs/pages/en/integrations/page.md`
   *  - And we will deploy it to `https://example.com/en/integrations/page`
   *
   * Then you can set the rewrite paths like this:
   * ```json
   * {
   *  "docs/": ""
   * }
   * ```
   *
   * This will rewrite the path to `en/integrations/page.md`
   * Which is the correct path for the deployed page and runtime scripts to work properly.
   *
   * Note: in runtime, which is client side, the final extension will be replaced with `.md` if the extension is `.html`.
   *
   * @deprecated
   */
  rewritePaths?: Record<string, string>
  /**
   * Rules to rewrite paths by patterns.
   *
   * Same as `rewritePaths`, but it can be a function that returns a promise or plain value.
   * Besides that, we offer some built-in handlers to rewrite paths by patterns:
   *
   *  - `rewritePathsByRewritingExtension(from: string, to: string)`: to rewrite paths by rewriting the extension.
   *
   * @example
   *
   * ```typescript
   * import { GitChangelog, rewritePathsByRewritingExtension } from '@nolebase/vitepress-plugin-git-changelog/vite'
   *
   * GitChangelog({
   *  rewritePathsBy: {
   *   // to rewrite `example.md` to `example.html`
   *  handler: rewritePathsByRewritingExtension('.md', '.html')
   * }
   * })
   * ```
   *
   * @see rewritePathsByRewritingExtension
   *
   * @deprecated
   *
   */
  rewritePathsBy?: RewritePathsBy
  /**
   * The maximum number of git logs to fetch.
   */
  maxGitLogCount?: number
  /**
   * The maximum number of concurrent processes to fetch git logs.
   *
   * @deprecated
   */
  maxConcurrentProcesses?: number
}

export function GitChangelog(options: GitChangelogOptions = {}): Plugin {
  if (!options)
    options = {}

  const {
    srcDir = '.',
    maxGitLogCount,
    includeDirs = [],
    includeExtensions = [],
    repoURL = 'https://github.com/example/example',
    getReleaseTagURL = defaultReleaseTagURLHandler,
    getReleaseTagsURL = defaultReleaseTagsURLHandler,
    getCommitURL = defaultCommitURLHandler,
  } = options

  let commits: Commit[] = []

  return {
    name: '@nolebase/vitepress-plugin-git-changelog',
    config: () => ({
      optimizeDeps: {
        include: [
          // @rive-app/canvas is a CJS/UMD module, so it needs to be included here
          // for Vite to properly bundle it.
          '@nolebase/vitepress-plugin-git-changelog > @nolebase/ui > @rive-app/canvas',
        ],
        exclude: [
          '@nolebase/vitepress-plugin-git-changelog/client',
        ],
      },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-git-changelog',
          // @nolebase/ui required here as noExternal to avoid the following error:
          // TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".vue" for ...
          // Read more here: https://github.com/vuejs/vitepress/issues/2915
          // And here: https://stackblitz.com/edit/vite-gjz9zf?file=docs%2F.vitepress%2Fconfig.ts
          '@nolebase/ui',
        ],
      },
    }),
    async buildStart() {
      const startsAt = Date.now()

      const spinner = ora(`${logModulePrefix} Prepare to gather git logs...`).start()

      const getRepoURL = typeof repoURL === 'function' ? repoURL : () => repoURL

      if (commits.length > 0)
        return

      // configure so that the git log messages can contain correct CJK characters
      await execa('git', ['config', '--local', 'core.quotepath', 'false'])

      spinner.text = `${logModulePrefix} Gathering git logs...`
      spinner.color = 'yellow'

      const paths = await globby(['**/*.md', '!node_modules'], {
        expandDirectories: {
          files: includeDirs,
          extensions: includeExtensions,
        },
        gitignore: true,
        cwd: cwd(),
      })

      commits = (await Promise.all(
        paths.map(async (path) => {
          return await getCommits(path, srcDir, getRepoURL, getCommitURL, getReleaseTagURL, getReleaseTagsURL, maxGitLogCount)
        }),
      ))
        .flat()

      const elapsed = Date.now() - startsAt
      spinner.succeed(`${logModulePrefix} Done. ${gray(`(${elapsed}ms)`)}`)
    },
    resolveId(id) {
      if (id === VirtualModuleID)
        return ResolvedVirtualModuleId
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null

      const changelog: Changelog = {
        commits,
      }

      return `export default ${JSON.stringify(changelog)}`
    },
  }
}
