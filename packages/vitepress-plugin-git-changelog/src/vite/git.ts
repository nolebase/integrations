import { posix, sep, win32 } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import type { Plugin } from 'vite'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'
import ora from 'ora'
import { cyan, gray } from 'colorette'
import { subtle } from 'uncrypto'

import type { Changelog, Commit } from '../types'

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
  repoURL?: string | ((commit: Commit) => string)
  /**
   * A function to get the release tag URL.
   *
   * @default (commit) => `${commit.repo_url}/releases/tag/${commit.tag}`
   */
  getReleaseTagURL?: (commit: Commit) => string
  /**
   * A function to get the commit URL.
   *
   * @default (commit) => `${commit.repo_url}/commit/${commit.hash}`
   */
  getCommitURL?: (commit: Commit) => string
  /**
   * A map that contains rewrite rules of paths.
   *
   * This is quite useful when you have your pages in a different directory than the base url after deployed since the
   * data will be calculated again on the client side.
   *
   * For example:
   *  - We have a page at `docs/pages/en/integrations/page.md`
   *  - And we will deploy it to `https://example.com/en/integrations/page.md`
   *
   * Then you can set the rewrite paths like this:
   * ```json
   * {
   *  "docs/": ""
   * }
   *
   * This will rewrite the path to `en/integrations/page.md`
   * Which is the correct path for the deployed page and runtime scripts to work properly.
   */
  rewritePaths?: Record<string, string>
  /**
   * The maximum number of git logs to fetch.
   */
  maxGitLogCount?: number
  /**
   * The maximum number of concurrent processes to fetch git logs.
   */
  maxConcurrentProcesses?: number
}

const VirtualModuleID = 'virtual:nolebase-git-changelog'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

const execAsync = promisify(exec)

/**
 * Hashes a string using SHA-256
 *
 * Official example by MDN: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * @param {string} message - The message to be hashed
 * @returns {Promise<string>} - The SHA-256 hash of the message
 */
export async function digestStringAsSHA256(message: string) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('') // convert bytes to hex string
  return hashHex
}

function normalizePath(path: string[][]) {
  // normalize paths
  for (const [index, files] of path.entries()) {
    if (files[1])
      path[index][1] = files[1].split(sep).join('/')

    if (files[2])
      path[index][2] = files[2].split(sep).join('/')
  }

  return path
}

function rewritePath(path: string[][], rewritePaths: Record<string, string>) {
  // rewrite paths
  for (const [index, files] of path.entries()) {
    for (const [key, value] of Object.entries(rewritePaths)) {
      if (files[1])
        path[index][1] = files[1].replace(key, value)

      if (files[2])
        path[index][2] = files[2].replace(key, value)
    }
  }

  return path
}

async function aggregateCommit(
  getReleaseTagURL: (log: Commit) => string,
  log: Commit,
  includeDirs: string[] = [],
  rewritePaths: Record<string, string> = {},
) {
  // release logs
  if (log.message.includes('release: ')) {
    log.tag = log.message
      .split(' ')[1]
      .trim()

    log.release_tag_url = getReleaseTagURL(log)

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
  log.path = normalizePath(log.path)
  // rewrite paths
  log.path = rewritePath(log.path, rewritePaths)

  return log
}

async function aggregateCommits(
  getRepoURL: (log: Commit) => string,
  getCommitURL: (log: Commit) => string,
  getReleaseTagURL: (log: Commit) => string,
  logs: Commit[],
  includeDirs: string[] = [],
  rewritePaths: Record<string, string> = {},
) {
  for (const log of logs) {
    // hash url
    log.hash_url = getCommitURL(log)
    // repo url
    log.repo_url = getRepoURL(log)
    // timestamp
    log.date_timestamp = new Date(log.date).getTime()
    // generate author avatar based on md5 hash of email (gravatar style)
    log.author_avatar = await digestStringAsSHA256(log.author_email)
  }

  const processedLogsPromises = logs.map(async log => aggregateCommit(getReleaseTagURL, log, includeDirs, rewritePaths))
  const processedLogs = await Promise.all(processedLogsPromises)
  return processedLogs.filter(i => i.path?.length || i.tag)
}

export function GitChangelog(options: GitChangelogOptions = {}): Plugin {
  if (!options)
    options = {}

  const {
    maxGitLogCount,
    maxConcurrentProcesses,
    includeDirs = [],
    repoURL = 'https://github.com/example/example',
    getReleaseTagURL = (commit: Commit) => `${commit.repo_url}/releases/tag/${commit.tag}`,
    getCommitURL = (commit: Commit) => `${commit.repo_url}/commit/${commit.hash}`,
    rewritePaths = {},
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

      const moduleNamePrefix = cyan('@nolebase/vitepress-plugin-git-changelog')
      const grayPrefix = gray(':')
      const spinnerPrefix = `${moduleNamePrefix}${grayPrefix}`

      const spinner = ora(`${spinnerPrefix} Prepare to gather git logs...`).start()

      const getRepoURL = typeof repoURL === 'function' ? repoURL : () => repoURL

      if (commits.length > 0)
        return

      git ??= simpleGit({
        maxConcurrentProcesses,
      })

      // configure so that the git log messages can contain correct CJK characters
      await git.raw(['config', '--local', 'core.quotepath', 'false'])

      spinner.text = `${spinnerPrefix} Gathering git logs...`
      spinner.color = 'yellow'

      const gitLogsRaw = await git.log({ maxCount: maxGitLogCount })
      const logs = gitLogsRaw.all as Commit[]

      spinner.text = `${spinnerPrefix} Aggregating git logs...`
      spinner.color = 'green'

      commits = await aggregateCommits(
        getRepoURL,
        getCommitURL,
        getReleaseTagURL,
        logs,
        includeDirs,
        rewritePaths,
      )

      const elapsed = Date.now() - startsAt
      spinner.succeed(`${spinnerPrefix} Done. ${gray(`(${elapsed}ms)`)}`)
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
