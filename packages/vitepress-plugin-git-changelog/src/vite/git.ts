import { posix, sep, win32 } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import type { Plugin } from 'vite'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'
import ora from 'ora'
import { cyan, gray } from 'colorette'

import type { Changelog, Commit } from '../types'
import {
  type CommitToStringHandler,
  type RewritePathsBy,
  digestStringAsSHA256,
  normalizeGitLogPath,
  returnOrResolvePromise,
  rewritePaths,
  rewritePathsByPatterns,
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

const defaultCommitURLHandler = (commit: Commit) => `${commit.repo_url}/commit/${commit.hash}`
const defaultReleaseTagURLHandler = (commit: Commit) => `${commit.repo_url}/releases/tag/${commit.tag}`

const execAsync = promisify(exec)

async function aggregateCommit(
  getReleaseTagURL: CommitToStringHandler,
  log: Commit,
  includeDirs: string[] = [],
  optsRewritePaths?: Record<string, string>,
  optsRewritePathsByPatterns?: RewritePathsBy,
) {
  // release logs
  if (log.message.includes('release: ')) {
    log.tag = log.message
      .split(' ')[1]
      .trim()

    log.release_tag_url = (await returnOrResolvePromise(getReleaseTagURL(log))) ?? defaultReleaseTagURLHandler(log)

    return log
  }

  // get change log of each file
  // const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
  // const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', '-M', log.hash])
  const raw = await execAsync(`git diff-tree --no-commit-id --name-status -r -M ${log.hash}`)

  const files = raw.stdout
    .replace(/\\/g, '/')
    .trim()
    .split('\n')
    .map(str => str.split('\t'))

  log.path = Array.from(
    new Set(
      files
        .filter((i) => {
          // include is not set, it is /^.+\md$/
          // include is set, it is /^(${include.join('|')})\/.+\md$/
          // in another word, /^(includeItem1|includeItem2|includeItem3)\/.+\md$/
          const regexp = new RegExp(`^${includeDirs.length > 0 ? `(${includeDirs.join('|')})${sep === win32.sep ? win32.sep : `\\${posix.sep}`}` : ''}.+\\.md$`)
          return !!i[1]?.match(regexp)?.[0]
        }),
    ),
  )

  // normalize paths
  log.path = normalizeGitLogPath(log.path)
  if (typeof optsRewritePaths !== 'undefined') {
    // rewrite paths
    log.path = rewritePaths(log.path, optsRewritePaths)
  }
  if (typeof optsRewritePathsByPatterns !== 'undefined') {
    // rewrite paths
    for (const [index, files] of log.path.entries()) {
      log.path[index][1] = await rewritePathsByPatterns(log, files[1], optsRewritePathsByPatterns)
      log.path[index][2] = await rewritePathsByPatterns(log, files[2], optsRewritePathsByPatterns)
    }
  }

  return log
}

async function aggregateCommits(
  getRepoURL: CommitToStringHandler,
  getCommitURL: CommitToStringHandler,
  getReleaseTagURL: CommitToStringHandler,
  logs: Commit[],
  includeDirs: string[] = [],
  rewritePaths?: Record<string, string>,
  rewritePathsBy?: RewritePathsBy,
) {
  for (const log of logs) {
    // hash url
    log.hash_url = (await returnOrResolvePromise(getCommitURL(log))) ?? defaultCommitURLHandler(log)
    // repo url
    log.repo_url = (await returnOrResolvePromise(getRepoURL(log))) ?? 'https://github.com/example/example'
    // timestamp
    log.date_timestamp = new Date(log.date).getTime()
    // generate author avatar based on md5 hash of email (gravatar style)
    log.author_avatar = await digestStringAsSHA256(log.author_email)
  }

  const processedLogsPromises = logs.map(async log => aggregateCommit(getReleaseTagURL, log, includeDirs, rewritePaths, rewritePathsBy))
  const processedLogs = await Promise.all(processedLogsPromises)

  return processedLogs.filter(i => i.path?.length || i.tag)
}

export interface GitChangelogOptions {
  /**
   * When fetching git logs, what directories should be included?
   */
  includeDirs?: string[]
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
   */
  rewritePathsBy?: RewritePathsBy
  /**
   * The maximum number of git logs to fetch.
   */
  maxGitLogCount?: number
  /**
   * The maximum number of concurrent processes to fetch git logs.
   */
  maxConcurrentProcesses?: number
}

export function GitChangelog(options: GitChangelogOptions = {}): Plugin {
  if (!options)
    options = {}

  const {
    maxGitLogCount,
    maxConcurrentProcesses,
    includeDirs = [],
    repoURL = 'https://github.com/example/example',
    getReleaseTagURL = defaultReleaseTagURLHandler,
    getCommitURL = defaultCommitURLHandler,
  } = options

  let commits: Commit[] = []
  let git: SimpleGit

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

      git ??= simpleGit({
        maxConcurrentProcesses,
      })

      // configure so that the git log messages can contain correct CJK characters
      await git.raw(['config', '--local', 'core.quotepath', 'false'])

      spinner.text = `${logModulePrefix} Gathering git logs...`
      spinner.color = 'yellow'

      const gitLogsRaw = await git.log({ maxCount: maxGitLogCount })
      const logs = gitLogsRaw.all as Commit[]

      spinner.text = `${logModulePrefix} Aggregating git logs...`
      spinner.color = 'green'

      commits = await aggregateCommits(
        getRepoURL,
        getCommitURL,
        getReleaseTagURL,
        logs,
        includeDirs,
        options.rewritePaths,
        options.rewritePathsBy,
      )

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

      const changelogData: Changelog = {
        commits,
      }

      return `export default ${JSON.stringify(changelogData)}`
    },
  }
}
