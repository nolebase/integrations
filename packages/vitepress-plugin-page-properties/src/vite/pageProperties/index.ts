import type { Plugin, ResolvedConfig } from 'vite'
import type { SiteConfig } from 'vitepress'
import type { LanguageHandler, ReadingTimeStats } from './dynamic/readingTime'
import type { PagePropertiesData } from './types'
import {
  existsSync,
  lstatSync,
  readFileSync,
} from 'node:fs'
import { extname, relative } from 'node:path'
import GrayMatter from 'gray-matter'
import { normalizePath } from 'vite'
import { calculateWordsCountAndReadingTime } from './dynamic/readingTime'

const VirtualModuleID = 'virtual:nolebase-page-properties'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

export type {
  LanguageHandler,
  ReadingTimeStats as ReadingTimeResult,
}

interface VitePressConfig extends ResolvedConfig {
  vitepress: SiteConfig
}

function normalizeWithRelative(from: string, path: string) {
  return normalizePath(relative(from, path)).toLowerCase()
}

export function PageProperties(): Plugin {
  let _config: VitePressConfig
  let srcDir = ''
  const calculatedPagePropertiesActualData: PagePropertiesData = {}
  const knownMarkdownFiles = new Set<string>()

  return {
    name: '@nolebase/vitepress-plugin-page-properties',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
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
      _config = config as VitePressConfig
      srcDir = _config.vitepress.srcDir
    },
    resolveId(id) {
      if (id === VirtualModuleID)
        return ResolvedVirtualModuleId
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null

      return `export default ${JSON.stringify(calculatedPagePropertiesActualData)}`
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      const parsedContent = GrayMatter(code)
      calculatedPagePropertiesActualData[normalizeWithRelative(srcDir, id)] = calculateWordsCountAndReadingTime(parsedContent.content)
    },
    configureServer(server) {
      Object.values(server.environments).forEach((env) => {
        env.hot.on('nolebase-page-properties:client-mounted', async (data) => {
          if (!data || typeof data !== 'object')
            return
          if (!('page' in data && 'filePath' in data.page))
            return

          const toMarkdownFilePath = data.page.filePath
          if (extname(data.page.filePath) !== '.md')
            return

          if (!knownMarkdownFiles.has(toMarkdownFilePath.toLowerCase())) {
            try {
              const exists = await existsSync(toMarkdownFilePath)
              if (!exists)
                return

              const stat = await lstatSync(toMarkdownFilePath)
              if (!stat.isFile())
                return

              knownMarkdownFiles.add(toMarkdownFilePath.toLowerCase())
            }
            catch {
              return
            }
          }
          if (!knownMarkdownFiles.has(toMarkdownFilePath.toLowerCase()))
            return

          const content = await readFileSync(toMarkdownFilePath, 'utf-8')
          const parsedContent = GrayMatter(content)
          calculatedPagePropertiesActualData[toMarkdownFilePath] = calculateWordsCountAndReadingTime(parsedContent.content)

          const virtualModule = env.moduleGraph.getModuleById(ResolvedVirtualModuleId)
          if (!virtualModule)
            return

          env.moduleGraph.invalidateModule(virtualModule)
          env.hot.send({
            type: 'custom',
            event: 'nolebase-page-properties:updated',
            data: calculatedPagePropertiesActualData,
          })
        })
      })
    },
  }
}
