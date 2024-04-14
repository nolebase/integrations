import {
  existsSync,
  lstatSync,
  readFileSync,
} from 'node:fs'
import { extname, join, relative } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import GrayMatter from 'gray-matter'
import type { PagePropertiesData } from './types'
import type { LanguageHandler, ReadingTimeStats } from './dynamic/readingTime'
import { calculateWordsCountAndReadingTime } from './dynamic/readingTime'

const VirtualModuleID = 'virtual:nolebase-page-properties'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

export type {
  LanguageHandler,
  ReadingTimeStats as ReadingTimeResult,
}

function normalizeWithRelative(from: string, path: string) {
  return normalizePath(relative(from, path)).toLowerCase()
}

function normalizeAsMarkdownPath(url: string) {
  // parse url to get the pathname without query strings
  let toMarkdownFilePath = url.split('?')[0]
  // if the pathname starts with '/', remove it
  if (toMarkdownFilePath.startsWith('/'))
    toMarkdownFilePath = toMarkdownFilePath.slice(1)
  // if the pathname ends with '/', append 'index.md'
  if (toMarkdownFilePath.endsWith('/')) {
    toMarkdownFilePath += 'index.md'
  }
  else {
    if (extname(toMarkdownFilePath) === '.html') {
      toMarkdownFilePath = toMarkdownFilePath
        .replace(/^(.+?)(\.html)?$/s, '$1.md')
    }
  }

  return toMarkdownFilePath
}

export function PageProperties(): Plugin {
  let _config: ResolvedConfig
  const data: PagePropertiesData = {}
  const knownMarkdownFiles = new Set<string>()

  return {
    name: '@nolebase/vitepress-plugin-page-properties',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        include: [
          '@nolebase/vitepress-plugin-page-properties > @nolebase/ui > @rive-canvas/app',
        ],
        exclude: [
          '@nolebase/vitepress-plugin-page-properties/client',
        ],
      },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-page-properties',
        ],
      },
    }),
    configResolved(config) {
      _config = config
    },
    resolveId(id) {
      if (id === VirtualModuleID)
        return ResolvedVirtualModuleId
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null

      return `export default ${JSON.stringify(data)}`
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      const parsedContent = GrayMatter(code)
      data[normalizeWithRelative(_config.root, id)] = calculateWordsCountAndReadingTime(parsedContent.content)
    },
    configureServer(server) {
      server.middlewares.use(async (req, _, next) => {
        if (!req)
          return next()
        if (!req.url)
          return next()

        const toMarkdownFilePath = normalizeAsMarkdownPath(req.url)
        if (extname(toMarkdownFilePath) !== '.md')
          return next()

        const completeFilePath = join(_config.root, toMarkdownFilePath)

        if (!knownMarkdownFiles.has(toMarkdownFilePath.toLowerCase())) {
          try {
            const exists = await existsSync(completeFilePath)
            if (!exists)
              return next()

            const stat = await lstatSync(completeFilePath)
            if (!stat.isFile())
              return next()

            knownMarkdownFiles.add(toMarkdownFilePath.toLowerCase())
          }
          catch (e) {
            return next()
          }
        }
        if (!knownMarkdownFiles.has(toMarkdownFilePath.toLowerCase()))
          return next()

        const content = await readFileSync(completeFilePath, 'utf-8')
        const parsedContent = GrayMatter(content)
        const key = normalizeWithRelative(_config.root, completeFilePath)
        data[key] = calculateWordsCountAndReadingTime(parsedContent.content)

        const virtualModule = server.moduleGraph.getModuleById(ResolvedVirtualModuleId)
        if (!virtualModule)
          return next()

        server.moduleGraph.invalidateModule(virtualModule)
        server.hot.send({
          type: 'custom',
          event: 'nolebase-page-properties:updated',
          data,
        })

        next()
      })
    },
    async handleHotUpdate(ctx) {
      const hotReloadingModuleFilePath = normalizeWithRelative(_config.root, ctx.file)

      if (extname(hotReloadingModuleFilePath) === '.md') {
        const virtualModule = ctx.server.moduleGraph.getModuleById(ResolvedVirtualModuleId)

        if (virtualModule) {
          const content = await ctx.read()
          const parsedContent = GrayMatter(content)
          data[hotReloadingModuleFilePath] = calculateWordsCountAndReadingTime(parsedContent.content)
          ctx.server.moduleGraph.invalidateModule(virtualModule)

          return [virtualModule]
        }
      }
    },
  }
}
