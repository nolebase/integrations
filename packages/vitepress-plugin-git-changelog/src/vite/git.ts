import { cwd as _cwd } from 'node:process'
import type { Plugin, ResolvedConfig } from 'vite'
import type { SiteConfig } from 'vitepress'
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
  getRawCommitLogs,
  getRelativePath,
  parseCommits,
  rewritePathsByRewritingExtension,
} from './helpers'
import type { GitChangelogOptions } from './types'

export type {
  CommitToStringHandler,
  CommitToStringsHandler,
  RewritePathsBy,
}

export {
  rewritePathsByRewritingExtension,
}

interface VitePressConfig extends ResolvedConfig {
  vitepress: SiteConfig
}

const VirtualModuleID = 'virtual:nolebase-git-changelog'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

const logModulePrefix = `${cyan(`@nolebase/vitepress-plugin-git-changelog`)}${gray(':')}`

export function GitChangelog(options: GitChangelogOptions = {}): Plugin {
  if (!options)
    options = {}

  const {
    cwd = _cwd(),
    maxGitLogCount,
    include = ['**/*.md', '!node_modules'],
    repoURL = 'https://github.com/example/example',
    getReleaseTagURL = defaultReleaseTagURLHandler,
    getReleaseTagsURL = defaultReleaseTagsURLHandler,
    getCommitURL = defaultCommitURLHandler,
    rewritePathsBy,
  } = options

  let commits: Commit[] = []
  let config: VitePressConfig

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
    configResolved(_config) {
      config = _config as VitePressConfig
    },
    async buildStart() {
      const startsAt = Date.now()

      const spinner = ora({ discardStdin: false, isEnabled: config.command === 'serve' })

      spinner.start(`${logModulePrefix} Prepare to gather git logs...`)

      const getRepoURL = typeof repoURL === 'function' ? repoURL : () => repoURL

      if (commits.length > 0)
        return

      // configure so that the git log messages can contain correct CJK characters
      await execa('git', ['config', '--local', 'core.quotepath', 'false'])

      spinner.text = `${logModulePrefix} Gathering git logs...`
      spinner.color = 'yellow'

      const paths = await globby(include, {
        gitignore: true,
        cwd,
        absolute: true,
      })

      const srcDir = config.vitepress.srcDir

      commits = (await Promise.all(
        paths.map(async (path) => {
          const rawLogs = await getRawCommitLogs(path, maxGitLogCount)
          const relativePath = getRelativePath(path, srcDir, cwd)
          return await parseCommits(relativePath, rawLogs, getRepoURL, getCommitURL, getReleaseTagURL, getReleaseTagsURL, rewritePathsBy)
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
