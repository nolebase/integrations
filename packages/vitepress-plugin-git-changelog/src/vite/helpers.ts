import type { Commit, CommitAuthor, Contributor, MergedRawCommit, RawCommit } from '../types'

import { basename, dirname, extname, posix, relative, sep, win32 } from 'node:path'

import { omit } from 'es-toolkit'
import { execa } from 'execa'
import { subtle } from 'uncrypto'
import { normalizePath } from 'vite'

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
 *
 * @deprecated
 */
export function generateCommitPathsRegExp(includeDirs: string[], includeExtensions: `.${string}`[]): RegExp {
  return new RegExp(`^${includeDirs.length > 0 ? `(${includeDirs.join('|')})${sep === win32.sep ? win32.sep : `\\${posix.sep}`}` : ''}.+${includeExtensions.length > 0 ? `(${includeExtensions.join('|')})` : '.md'}$`)
}

export function getRelativePath(file: string, srcDir: string, cwd: string) {
  cwd = normalizePath(cwd)
  return file.replace(srcDir, '').replace(cwd, '').replace(/^\//, '')
}

export async function getRawCommitLogs(file: string, maxGitLogCount?: number) {
  const fileDir = dirname(file)
  const fileName = basename(file)
  /**
   * The format of git log.
   *
   * ${commit_hash} ${author_name} ${author_email} ${author_date} ${subject} ${ref} ${body}
   *
   * @see {@link https://git-scm.com/docs/pretty-formats | documentation} for details.
   *
   * Note: Make sure that `body` is in last position, as `\n` or `|` in body may breaks subsequent processing.
   *
   * @example stdout
   *
   * ```bash
   * $ git log --format="%H|%an|%ae|%ad|%s|%d|%b[GIT_LOG_COMMIT_END]" --follow docs/pages/en/integrations/index.md
   * 62ef7ed8f54ea1faeacf6f6c574df491814ec1b1|Neko Ayaka|neko@ayaka.moe|Wed Apr 24 14:24:44 2024 +0800|docs: fix english integrations list||Signed-off-by: Neko Ayaka <neko@ayaka.moe>
   * [GIT_LOG_COMMIT_END]
   * 34357cc0956db77d1fc597327ba880d7eebf67ce|Rizumu Ayaka|rizumu@ayaka.moe|Mon Apr 22 22:51:24 2024 +0800|release: pre-release v2.0.0-rc10| (tag: v2.0.0-rc10)|Signed-off-by: Rizumu Ayaka <rizumu@ayaka.moe>
   * [GIT_LOG_COMMIT_END]
   * (END)
   * ```
   */
  const format = '%H|%an|%ae|%ad|%s|%d|%b'
  const { stdout } = await execa('git', ['log', `--max-count=${maxGitLogCount ?? -1}`, `--format=${format}[GIT_LOG_COMMIT_END]`, '--follow', '--', fileName], { cwd: fileDir })
  // remove "[GIT_LOG_COMMIT_END]" in last line: split stdout into lines and avoid empty strings
  return stdout.replace(/\[GIT_LOG_COMMIT_END\]$/, '').split('[GIT_LOG_COMMIT_END]\n')
}

export function parseRawCommitLogs(
  path: string,
  rawLogs: string[],
): RawCommit[] {
  return rawLogs
    .filter(log => !!log)
    .map((raw) => {
      const [hash, author_name, author_email, date, message, refs, body] = raw.split('|').map(v => v.trim())
      return {
        path,
        hash,
        date,
        message,
        body,
        refs,
        author_name,
        author_email,
      }
    })
}

export function mergeRawCommits(rawCommits: RawCommit[]): MergedRawCommit[] {
  const commitMap = new Map<string, MergedRawCommit>()

  rawCommits.forEach((commit) => {
    const _commit = commitMap.get(commit.hash)
    if (_commit)
      _commit.paths.push(commit.path)
    else
      commitMap.set(commit.hash, { paths: [commit.path], ...omit(commit, ['path']) })
  })

  return Array.from(commitMap.values())
}

export async function parseCommits(
  rawCommits: MergedRawCommit[],
  getRepoURL: CommitToStringHandler,
  getCommitURL: CommitToStringHandler,
  getReleaseTagURL: CommitToStringHandler,
  getReleaseTagsURL: CommitToStringsHandler,
  mapContributors?: Contributor[],
  optsRewritePathsBy?: RewritePathsBy,
): Promise<{ commits: Commit[], authors: CommitAuthor[] }> {
  const allAuthors = new Map<string, CommitAuthor>()
  const resolvedCommits = await Promise.all(rawCommits.map(async (rawCommit) => {
    const { paths, hash, date, refs, message } = rawCommit

    const resolvedCommit: Commit = {
      paths,
      hash,
      date_timestamp: new Date(date).getTime(),
      message,
      authors: [],
    }

    // rewrite path
    // Ensure that paths are processed first, as users may generate other properties based on this one.
    if (typeof optsRewritePathsBy !== 'undefined')
      await Promise.all(rawCommit.paths.map(async p => await rewritePathsByPatterns(resolvedCommit, p, optsRewritePathsBy)))

    // repo url
    resolvedCommit.repo_url = (await returnOrResolvePromise(getRepoURL(resolvedCommit))) ?? 'https://github.com/example/example'
    // hash url
    resolvedCommit.hash_url = (await returnOrResolvePromise(getCommitURL(resolvedCommit))) ?? defaultCommitURLHandler(resolvedCommit)

    // remove `()` in refs, e.g. ` (tag: v2.0.0-rc7)`
    const tags = parseGitLogRefsAsTags(refs?.replace(/[()]/g, ''))

    // release logs
    if (tags && tags.length > 0) {
      resolvedCommit.tags = tags
      resolvedCommit.tag = resolvedCommit.tags?.[0] || undefined
      resolvedCommit.release_tag_url = (await returnOrResolvePromise(getReleaseTagURL(resolvedCommit))) ?? defaultReleaseTagURLHandler(resolvedCommit)
      resolvedCommit.release_tags_url = (await returnOrResolvePromise(getReleaseTagsURL(resolvedCommit))) ?? defaultReleaseTagsURLHandler(resolvedCommit)
    }

    // authors
    const authors = await parseCommitAuthors(rawCommit, mapContributors)
    authors.forEach(a => allAuthors.set(a.name, omit(a, ['email'])))
    resolvedCommit.authors = authors.map(a => a.name)

    // generate author avatar based on md5 hash of email (gravatar style)
    // resolvedCommit.author_avatar = await digestStringAsSHA256(rawCommit.author_email)

    return resolvedCommit
  }))

  return { commits: resolvedCommits, authors: [...allAuthors.values()] }
}

export async function parseCommitAuthors(commit: MergedRawCommit, mapContributors?: Contributor[]): Promise<CommitAuthor[]> {
  const { author_name, author_email, body } = commit

  const commitAuthor: CommitAuthor = {
    name: author_name,
    email: author_email,
  }
  const coAuthors = getCoAuthors(body)

  return await Promise.all([commitAuthor, ...coAuthors]
    // exclude bot users
    .filter(v => !(v.name.match(/\[bot\]/i) || v.email?.match(/\[bot\]/i)))
    // map authors
    .map(async (author) => {
      const targetCreatorByName = findMapAuthorByName(mapContributors, author.name)
      if (targetCreatorByName) {
        author.name = targetCreatorByName.name ?? author.name
        author.i18n = findMapAuthorI18n(targetCreatorByName)
        author.url = findMapAuthorLink(targetCreatorByName)
        author.avatarUrl = await newAvatarForAuthor(targetCreatorByName, author.email!)
        return author
      }
      const targetCreatorByEmail = author.email && findMapAuthorByEmail(mapContributors, author.email)
      if (targetCreatorByEmail) {
        author.name = targetCreatorByEmail.name ?? author.name
        author.i18n = findMapAuthorI18n(targetCreatorByEmail)
        author.url = findMapAuthorLink(targetCreatorByEmail)
        author.avatarUrl = await newAvatarForAuthor(targetCreatorByEmail, author.email!)
        return author
      }
      const targetCreatorByGitHub = findMapAuthorByGitHub(mapContributors, author.name, author.email!)
      if (targetCreatorByGitHub) {
        author.name = targetCreatorByGitHub.name ?? author.name
        author.i18n = findMapAuthorI18n(targetCreatorByGitHub)
        author.url = findMapAuthorLink(targetCreatorByGitHub)
        author.avatarUrl = await newAvatarForAuthor(targetCreatorByGitHub, author.email!)
        return author
      }
      author.avatarUrl = await newAvatarForAuthor(undefined, author.email!)
      return author
    }))
}

/**
 * This regular expression is used to match and parse commit messages that contain multiple author information.
 *
 * @see {@link https://regex101.com/r/q5YB8m/1 | Regexp demo}
 * @see {@link https://en.wikipedia.org/wiki/Email_address#Local-part | Email address}
 * @see {@link https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors | Creating a commit with multiple authors in GitHub}
 */
const multipleAuthorsRegex = /^ *Co-authored-by: ?([^<]*)<([^>]*)> */gim

// This function handles multiple authors in a commit.
// It uses the regular expression to extract the name and email of each author from the commit message.
// About the docs: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
export function getCoAuthors(body?: string): CommitAuthor[] {
  if (!body)
    return []

  return [...body.matchAll(multipleAuthorsRegex)].map((result) => {
    const [, name, email] = result
    return {
      name: name.trim(),
      email: email.trim(),
    }
  }).filter(v => !!v)
}

export function findMapAuthorByName(mapContributors: Contributor[] | undefined, author_name: string) {
  return mapContributors?.find((item) => {
    const res = (item.mapByNameAliases && Array.isArray(item.mapByNameAliases) && item.mapByNameAliases.includes(author_name)) || item.name === author_name || item.username === author_name
    if (res)
      return true

    // This is a fallback for the old version of the configuration.
    return item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(author_name)
  })
}

export function findMapAuthorByEmail(mapContributors: Contributor[] | undefined, author_email: string) {
  return mapContributors?.find((item) => {
    const res = item.mapByEmailAliases && Array.isArray(item.mapByEmailAliases) && item.mapByEmailAliases.includes(author_email)
    if (res)
      return true

    // This is a fallback for the old version of the configuration.
    return item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(author_email)
  })
}

export function findMapAuthorByGitHub(mapContributors: Contributor[] | undefined, author_name: string, author_email: string) {
  const github = getGitHubUserNameFromNoreplyAddress(author_email)
  if (github && github.userName) {
    const mappedByName = findMapAuthorByName(mapContributors, github.userName)
    if (mappedByName && mappedByName.username) {
      mappedByName.username ||= github.userName
      return mappedByName
    }
    return {
      name: author_name,
      username: github.userName,
    }
  }
}

export function findMapAuthorLink(creator: Contributor): string | undefined {
  if (!creator.links && !!creator.username)
    return `https://github.com/${creator.username}`

  if (typeof creator.links === 'string' && !!creator.links)
    return creator.links
  if (!Array.isArray(creator.links))
    return

  const priority = ['github', 'twitter']
  for (const p of priority) {
    const matchedEntry = creator.links?.find(l => l.type === p)
    if (matchedEntry)
      return matchedEntry.link
  }

  return creator.links?.[0]?.link
}

export function findMapAuthorI18n(mappedAuthor: Contributor): Record<string, string> | undefined {
  if (mappedAuthor && mappedAuthor.i18n) {
    return mappedAuthor.i18n
  }
  return undefined
}

// based on https://github.com/nolebase/integrations/issues/277#issuecomment-2254111802
export function getGitHubUserNameFromNoreplyAddress(email: string) {
  const match = email.match(/^(?:(?<userId>\d+)\+)?(?<userName>[a-zA-Z\d-]{1,39})@users.noreply.github.com$/)
  if (!match || !match.groups)
    return undefined

  const { userName, userId } = match.groups
  return { userId, userName }
}

export async function newAvatarForAuthor(mappedAuthor: Contributor | undefined, email: string): Promise<string> {
  if (mappedAuthor) {
    if (mappedAuthor.avatar)
      return mappedAuthor.avatar
    if (mappedAuthor.username)
      return `https://github.com/${mappedAuthor.username}.png`
  }

  return `https://gravatar.com/avatar/${await digestStringAsSHA256(email)}?d=retro`
}
