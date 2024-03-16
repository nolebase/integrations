import { relative, sep } from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { DefaultTheme, SiteConfig } from 'vitepress'
import { green, red, yellow } from 'colorette'

import { flattenSidebar, getSidebar } from './utils/vitepress/sidebar'
import { renderSVGAndRewriteHTML, tryToLocateTemplateSVGFile } from './utils/svg/render'
import { type TaskResult, renderTaskResultsSummary, task } from './utils/task'
import type { PageItem } from './types'

export function buildEndGenerateOpenGraphImages(options: {
  domain: string
}) {
  return async (siteConfig: SiteConfig) => {
    await task('rendering open graph images', async (): Promise<string | undefined> => {
      const themeConfig = siteConfig.site.themeConfig as unknown as DefaultTheme.Config
      const sidebar = getSidebar(siteConfig.site, themeConfig)

      // Flatten sidebar
      let pages: PageItem[] = []

      for (const locale of sidebar.locales) {
        const flattenedSidebar = flattenSidebar(sidebar.sidebar[locale])

        const items = flattenedSidebar.map((item) => {
          return {
            ...item,
            // TODO: What to do with `text`?
            text: item.text || 'Untitled',
            // TODO: Auto resolve categories or read categories mappings from somewhere
            category: 'Un-categorized',
            locale,
          }
        }) satisfies PageItem[]

        pages = pages.concat(items)
      }

      const files = await fg(`${siteConfig.outDir}/**/*.html`, { onlyFiles: true })

      // TODO: Load public files in a better way
      const ogImageTemplateSvgPath = await tryToLocateTemplateSVGFile(siteConfig)
      if (!ogImageTemplateSvgPath)
        return `${green(`${0} generated`)}, ${yellow(`${files.length} (all) skipped`)}, ${red(`${0} errored`)}. failed to locate ${yellow('og-template.svg')} under public or plugin directory, did you forget to put it? will skip open graph image generation.`

      const ogImageTemplateSvg = fs.readFileSync(ogImageTemplateSvgPath, 'utf-8')

      const generatedForFiles = await Promise.all(files.map(async (file): Promise<TaskResult> => {
        // TODO: Maybe have a better way to deal with Windows or other OS
        const relativePath = relative(siteConfig.outDir, file)

        const link = `/${
          relativePath
          .slice(0, relativePath.lastIndexOf('.'))
          .replaceAll(sep, '/')
        }`.split('/index')[0]

        const page = pages.find((item) => {
          if (item.link === link)
            return true

          if (item.link === `${link}/`)
            return true

          return false
        })
        if (!page) {
          return {
            filePath: file,
            status: 'skipped',
            reason: 'page not found in sidebar',
          }
        }

        return await renderSVGAndRewriteHTML(siteConfig, page, file, ogImageTemplateSvg, ogImageTemplateSvgPath, options.domain)
      }))

      return renderTaskResultsSummary(generatedForFiles, siteConfig)
    })
  }
}
