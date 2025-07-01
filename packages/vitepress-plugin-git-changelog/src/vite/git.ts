import type { Plugin, ResolvedConfig } from 'vite'
import type { SiteConfig } from 'vitepress'

import type { Author, Changelog } from '../types'
import type { CommitToStringHandler, CommitToStringsHandler, RewritePathsBy } from './helpers'
import type { GitChangelogOptions } from './types'

import { join } from 'node:path'
import { cwd as _cwd } from 'node:process'

import { cyan, gray } from 'colorette'
import { execa } from 'execa'
import { globby } from 'globby'
import { normalizePath } from 'vite'

import {

  defaultCommitURLHandler,
  defaultReleaseTagsURLHandler,
  defaultReleaseTagURLHandler,
  getRawCommitLogs,
  getRelativePath,
  mergeRawCommits,
  parseCommits,
  parseRawCommitLogs,

  rewritePathsByRewritingExtension,
} from './helpers'

export type {
  Author,
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
const logger = console

export function GitChangelog(options: GitChangelogOptions = {}): Plugin {
  if (!options)
    options = {}

  const {
    cwd = _cwd(),
    maxGitLogCount,
    include = ['**/*.md', '!node_modules'],
    mapAuthors,
    repoURL = 'https://github.com/example/example',
    getReleaseTagURL = defaultReleaseTagURLHandler,
    getReleaseTagsURL = defaultReleaseTagsURLHandler,
    getCommitURL = defaultCommitURLHandler,
    rewritePathsBy,
  } = options

  const getRepoURL = typeof repoURL === 'function' ? repoURL : () => repoURL

  const changelog: Changelog = { commits: [], authors: [] }
  const hotModuleReloadCachedCommits = new Map<string, Changelog>()
  let srcDir = ''
  let config: VitePressConfig

  const commitFromPath = async (paths: string[]) => {
    const rawCommits = (await Promise.all(paths.map(async (path) => {
      const rawLogs = await getRawCommitLogs(path, maxGitLogCount)
      const relativePath = getRelativePath(path, srcDir, cwd)
      const rawCommits = parseRawCommitLogs(relativePath, rawLogs)
      return rawCommits
    }))).flat()
    const mergedRawCommits = mergeRawCommits(rawCommits)
    const resolvedCommits = parseCommits(
      mergedRawCommits,
      getRepoURL,
      getCommitURL,
      getReleaseTagURL,
      getReleaseTagsURL,
      mapAuthors,
      rewritePathsBy,
    )
    return resolvedCommits
  }

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
      srcDir = config.vitepress.srcDir
    },
    async buildStart() {
      if (config.command !== 'build')
        return

      const startsAt = Date.now()
      logger.info(`${logModulePrefix} Prepare to gather git logs...`)

      if (changelog.commits.length > 0)
        return

      // configure so that the git log messages can contain correct CJK characters
      await execa('git', ['config', '--local', 'core.quotepath', 'false'])

      const paths = await globby(include, {
        gitignore: true,
        cwd,
        absolute: true,
      })

      Object.assign(changelog, await commitFromPath(paths))

      const elapsed = Date.now() - startsAt
      logger.info(`${logModulePrefix} Done. ${gray(`(${elapsed}ms)`)}`)
    },
    resolveId(source) {
      if (source.startsWith(VirtualModuleID))
        return `\0${source}`
    },
    load(id) {
      if (!id.startsWith(ResolvedVirtualModuleId))
        return null

      return `export default ${JSON.stringify(changelog, null, config.isProduction ? 0 : 2)}`
    },
    configureServer(server) {
      compatibleConfigureServer(server, (_, env) => {
        env.hot.on('nolebase-git-changelog:client-mounted', async (data) => {
          if (!data || typeof data !== 'object')
            return
          if (!('page' in data && 'filePath' in data.page))
            return

          let result = hotModuleReloadCachedCommits.get(data.page.filePath)
          if (!result) {
            const path = normalizePath(join(srcDir, data.page.filePath))
            result = await commitFromPath([path])
            hotModuleReloadCachedCommits.set(data.page.filePath, result)
          }

          Object.assign(changelog, result)

          if (!result!.commits.length)
            return

          const virtualModule = env.moduleGraph.getModuleById(ResolvedVirtualModuleId)
          if (!virtualModule)
            return

          env.moduleGraph.invalidateModule(virtualModule)
          env.hot.send({
            type: 'custom',
            event: 'nolebase-git-changelog:updated',
            data: changelog,
          })
        })
      })
    },
  }
}

interface Environment {
  hot: {
    on: (event: string, handler: (data: any) => void) => void
    send: (data: any) => void
  }
  moduleGraph: {
    getModuleById: (id: string) => any
    invalidateModule: (module: any) => void
  }
}

function compatibleConfigureServer<E extends Environment>(server: E, registerHandler: (name: string, env: E) => void | Promise<void>) {
// Temporary workaround for Vite 5, both register for environments and server
  // When VitePress is upgraded to Vite 6, this can be removed
  if ('environments' in server && typeof server.environments === 'object' && server.environments != null) {
    Object.entries(server.environments).forEach(([name, env]) => registerHandler(name, env))
  }
  else {
    registerHandler('server', server)
  }
}
