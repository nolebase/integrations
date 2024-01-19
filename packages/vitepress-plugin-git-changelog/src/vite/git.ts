import { posix, sep, win32 } from 'node:path'
import type { Plugin } from 'vite'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'
import md5 from 'md5'
import type { Changelog, Commit } from '../types'

const VirtualModuleID = 'virtual:nolebase-git-changelog'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

export function GitChangelog(options: {
  includeDirs?: string[]
  repoURL?: string | ((commit: Commit) => string)
  getReleaseTagURL?: (commit: Commit) => string
  getCommitURL?: (commit: Commit) => string
  rewritePaths?: Record<string, string>
  maxGitLogCount?: number
} = {}): Plugin {
  if (!options)
    options = {}

  const {
    maxGitLogCount = 200,
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
        exclude: [
          '@nolebase/vitepress-plugin-git-changelog/client',
        ],
      },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-git-changelog',
        ],
      },
    }),
    async buildStart() {
      const getRepoURL = typeof repoURL === 'function' ? repoURL : () => repoURL

      if (commits.length > 0)
        return

      git ??= simpleGit({
        maxConcurrentProcesses: 200,
      })

      // configure so that the git log messages can contain correct CJK characters
      await git.raw(['config', '--global', 'core.quotepath', 'false'])

      const logs = (await git.log({ maxCount: maxGitLogCount })).all as Commit[]

      for (const log of logs)
        log.repo_url = getRepoURL(log)

      for (const log of logs) {
        // hash url
        log.hash_url = getCommitURL(log)

        // release logs
        if (log.message.includes('release: ')) {
          log.tag = log.message
            .split(' ')[1]
            .trim()

          log.release_tag_url = getReleaseTagURL(log)
          continue
        }

        // get change log of each file
        // const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
        const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', '-M', log.hash])
        // delete log.body

        const files = raw
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
        for (const [index, files] of log.path.entries()) {
          if (files[1])
            log.path[index][1] = files[1].split(sep).join('/')

          if (files[2])
            log.path[index][2] = files[2].split(sep).join('/')
        }

        // rewrite paths
        for (const [index, files] of log.path.entries()) {
          for (const [key, value] of Object.entries(rewritePaths)) {
            if (files[1])
              log.path[index][1] = files[1].replace(key, value)

            if (files[2])
              log.path[index][2] = files[2].replace(key, value)
          }
        }

        log.author_avatar = md5(log.author_email) as string
      }

      const result = logs.filter(i => i.path?.length || i.tag)
      commits = result
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
