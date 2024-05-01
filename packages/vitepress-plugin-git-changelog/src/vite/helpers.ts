import { basename, dirname, extname, join, posix, relative, sep, win32 } from 'node:path'
import fs from 'node:fs'
import { subtle } from 'uncrypto'
import { normalizePath } from 'vite'
import { execa } from 'execa'
import type { Commit } from '../types'

export interface Helpers {
  /**
   * A helper function to help to determine whether the passed string parameter equals the
   * current transforming module ID with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param equalsWith - String to equal with
   * @returns boolean
   */
  idEquals: (equalsWith: string) => boolean
  /**
   * A helper function to help to determine whether the passed string parameter startsWith the
   * current transforming module ID with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param startsWith - String to start with
   * @returns boolean
   */
  idStartsWith: (startsWith: string) => boolean
  /**
   * A helper function to help to determine whether the passed string parameter endsWith the
   * current transforming module ID with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param endsWith - String to end with
   * @returns boolean
   */
  idEndsWith: (endsWith: string) => boolean
  /**
   * A helper function to help to determine whether the passed first path parameter
   * equals the second passed string with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param path - Path to be compared with
   * @param equalsWith - String to equal with
   * @returns boolean
   */
  pathEquals: (path: string, equalsWith: string) => boolean
  /**
   * A helper function to help to determine whether the passed first path parameter
   * startsWith the second passed string with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param path - Path to be compared with
   * @param startsWith - String to start with
   * @returns boolean
   */
  pathStartsWith: (path: string, startsWith: string) => boolean
  /**
   * A helper function to help to determine whether the passed first path parameter
   * endsWith the second passed string with normalization of paths capabilities and
   * cross platform / OS compatibilities.
   *
   * @param path - Path to be compared with
   * @param endsWith - String to end with
   * @returns boolean
   */
  pathEndsWith: (path: string, endsWith: string) => boolean
}

export function pathEquals(path: string, equals: string): boolean {
  return normalizePath(path) === (normalizePath(equals))
}

export function pathStartsWith(path: string, startsWith: string): boolean {
  return normalizePath(path).startsWith(normalizePath(startsWith))
}

export function pathEndsWith(path: string, startsWith: string): boolean {
  return normalizePath(path).endsWith(normalizePath(startsWith))
}

export function createHelpers(root: string, id: string): Helpers {
  const relativeId = relative(root, id)

  return {
    pathStartsWith,
    pathEquals,
    pathEndsWith,
    idEndsWith(endsWith: string) {
      return pathEndsWith(relativeId, endsWith)
    },
    idEquals(equals: string) {
      return pathEquals(relativeId, equals)
    },
    idStartsWith(startsWith: string) {
      return pathStartsWith(relativeId, startsWith)
    },
  }
}

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

export function normalizeGitLogPath(path: string[][]) {
  // normalize paths
  for (const [index, files] of path.entries()) {
    if (files[1])
      path[index][1] = normalizePath(files[1])

    if (files[2])
      path[index][2] = normalizePath(files[2])
  }

  return path
}

export type CommitToStringHandler = (commit: Commit) => string | Promise<string> | null | undefined
export type CommitToStringsHandler = (commit: Commit) => string[] | Promise<string[]> | null | undefined
export type CommitAndPathToStringHandler = (commit: Commit, path: string) => string | Promise<string> | null | undefined
export interface RewritePathsBy { handler?: CommitAndPathToStringHandler }

export const defaultCommitURLHandler = (commit: Commit) => `${commit.repo_url}/commit/${commit.hash}`
export const defaultReleaseTagURLHandler = (commit: Commit) => `${commit.repo_url}/releases/tag/${commit.tag}`
export const defaultReleaseTagsURLHandler = (commit: Commit) => commit.tags?.map(tag => `${commit.repo_url}/releases/tag/${tag}`)

export async function returnOrResolvePromise<T>(val: T | Promise<T>) {
  if (!(val instanceof Promise))
    return val

  return await val
}

export function rewritePaths(path: string, rewritePaths: Record<string, string>) {
  // rewrite paths
  for (const [key, value] of Object.entries(rewritePaths))
    path = path.replace(key, value)

  return path
}

export async function rewritePathsByPatterns(commit: Commit, path: string, patterns?: RewritePathsBy): Promise<string> {
  if (typeof patterns === 'undefined' || patterns === null)
    return path

  if ('handler' in patterns && typeof patterns.handler === 'function') {
    const resolvedPath = await returnOrResolvePromise(patterns.handler(commit, path))
    if (!resolvedPath)
      return path

    return resolvedPath
  }

  return path
}

/**
 * A rewritePathsBy.handler handler that rewrites paths by rewriting the extension.
 *
 * @example
 *
 * ```typescript
 * import { GitChangelog, rewritePathsByRewritingExtension } from '@nolebase/vitepress-plugin-git-changelog/vite'
 *
 * GitChangelog({
 *   rewritePathsBy: {
 *     // to rewrite `example.md` to `example.html`
 *     handler: rewritePathsByRewritingExtension('.md', '.html')
 *   }
 * })
 * ```
 *
 * @param from - The extension to rewrite from.
 * @param to - The extension to rewrite to.
 * @returns A handler that rewrites paths by rewriting the extension.
 */
export function rewritePathsByRewritingExtension(from: string, to: string) {
  return (_: Commit, path: string) => {
    const ext = extname(path)
    if (ext !== from)
      return path

    return path.replace(new RegExp(`${from}$`), to)
  }
}

export function parseGitLogRefsAsTags(refs?: string): string[] {
  if (!refs)
    return []

  const refsArray = refs.split(', ').map(ref => ref.trim())
  const tags = refsArray.filter(ref => ref.startsWith('tag: '))
  if (!tags)
    return []

  return tags.map(tag => tag.replace('tag: ', '').trim())
}

/**
 * Generate RegExp for filtering out paths of commits.
 *
 * It follows the rules that:
 * - includes is not set, it is /^.+.md$/
 * - includeDirs is set, it is /^(${includeDirs.join('|')})\/.+.md$/
 * - includeExtensions is set, it is /^.+(${includeExtensions.join('|')})$/
 * - in another word, /^(includeDir1|includeDir2)\/.+(includeExtension1|includeExtensions2)$/
 */
export function generateCommitPathsRegExp(includeDirs: string[], includeExtensions: `.${string}`[]): RegExp {
  return new RegExp(`^${includeDirs.length > 0 ? `(${includeDirs.join('|')})${sep === win32.sep ? win32.sep : `\\${posix.sep}`}` : ''}.+${includeExtensions.length > 0 ? `(${includeExtensions.join('|')})` : '.md'}$`)
}

export async function getCommits(
  path: string,
  cwd: string,
  getRepoURL: CommitToStringHandler,
  getCommitURL: CommitToStringHandler,
  getReleaseTagURL: CommitToStringHandler,
  getReleaseTagsURL: CommitToStringsHandler,
  maxGitLogCount?: number,
  optsRewritePaths?: Record<string, string>,
  optsRewritePathsByPatterns?: RewritePathsBy,
): Promise<Commit[]> {
  cwd = dirname(join(cwd, path))
  if (!fs.existsSync(cwd))
    return []
  const fileName = basename(path)
  const { stdout } = await execa('git', ['log', `--max-count=${maxGitLogCount ?? -1}`, '--format=%H|%an|%ae|%ad|%s|%d|%d', '--follow', '--', fileName], { cwd })

  const commits = await Promise.all(stdout.split('\n').map(async (raw) => {
    const [hash, author_name, author_email, date, message, body, refs] = raw.split('|')
    const commit: Commit = {
      path,
      hash,
      date,
      date_timestamp: 0,
      message,
      body,
      author_name,
      author_email,
      author_avatar: '',
    }

    // rewrite path
    if (typeof optsRewritePaths !== 'undefined')
      commit.path = rewritePaths(commit.path, optsRewritePaths)
    if (typeof optsRewritePathsByPatterns !== 'undefined')
      commit.path = await rewritePathsByPatterns(commit, commit.path, optsRewritePathsByPatterns)

    // repo url
    commit.repo_url = (await returnOrResolvePromise(getRepoURL(commit))) ?? 'https://github.com/example/example'
    // hash url
    commit.hash_url = (await returnOrResolvePromise(getCommitURL(commit))) ?? defaultCommitURLHandler(commit)

    const tags = parseGitLogRefsAsTags(refs?.replace(/[\(\)]/g, ''))

    // release logs
    if (tags && tags.length > 0) {
      commit.tags = tags
      commit.tag = commit.tags?.[0] || undefined
      commit.release_tag_url = (await returnOrResolvePromise(getReleaseTagURL(commit))) ?? defaultReleaseTagURLHandler(commit)
      commit.release_tags_url = (await returnOrResolvePromise(getReleaseTagsURL(commit))) ?? defaultReleaseTagsURLHandler(commit)
    }

    // timestamp
    commit.date_timestamp = new Date(commit.date).getTime()
    // generate author avatar based on md5 hash of email (gravatar style)
    commit.author_avatar = await digestStringAsSHA256(commit.author_email)

    return commit
  }))

  return commits
}
