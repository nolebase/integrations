import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Buffer } from 'node:buffer'
import { unified } from 'unified'
import RehypeMeta from 'rehype-meta'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { DefaultTheme, SiteConfig } from 'vitepress'
import { gray, green, red, yellow } from 'colorette'
import { flattenSidebar, getSidebar } from './utils/vitepress/sidebar'
import { renderSVG, templateSVG } from './utils/svg/render'
import { task } from './utils/task'
import { getDescriptionWithLocales, getTitleWithLocales } from './utils/vitepress/locales'

interface PageItem extends DefaultTheme.SidebarItem {
  text: string
  category?: string
  locale: string
}

async function tryToLocateTemplateSVGFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const templateSvgPathUnderPublicDir = resolve(siteConfig.root, 'public', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderPublicDir))
    return templateSvgPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const templateSvgPathUnderRootDir = resolve(__dirname, 'assets', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderRootDir))
    return templateSvgPathUnderRootDir

  return undefined
}

async function tryToLocateFontFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const fontPathUnderPublicDir = resolve(siteConfig.root, 'public', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderPublicDir))
    return fontPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const fontPathUnderRootDir = resolve(__dirname, 'assets', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderRootDir))
    return fontPathUnderRootDir

  return undefined
}

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

      const generatedForFiles = await Promise.all(files.map(async (file): Promise<{ status: 'success' | 'skipped' | 'errored' }> => {
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
        if (!page)
          return { status: 'skipped' }

        const siteTitle = getTitleWithLocales(siteConfig.site, page.locale)
        const siteDescription = getDescriptionWithLocales(siteConfig.site, page.locale)

        const ogImageFilePathBaseName = `og-${page.text || 'Untitled'}.png`
        const ogImageFilePathFullName = `${dirname(file)}/${ogImageFilePathBaseName}`
        const templatedOgImageSvg = templateSVG(siteTitle, siteDescription, page.text, page.category ?? '', ogImageTemplateSvg)

        let pngBuffer: Buffer

        try {
          pngBuffer = await renderSVG(templatedOgImageSvg, { fontPath: await tryToLocateFontFile(siteConfig) })
        }
        catch (err) {
          console.error(
          `${red('✗')} failed to generate open graph image as ${green(`[${relative(siteConfig.root, ogImageFilePathFullName)}]`)} with ${green(`[${relative(siteConfig.root, ogImageTemplateSvgPath)}]`)} due to ${red(String(err))}`,
          `skipped open graph image generation for ${green(`[${relative(siteConfig.root, file)}]`)}`,
          `\n\nSVG Content:\n\n${templatedOgImageSvg}`,
          `\n\nDetailed stack information bellow:\n\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`,
          )

          return { status: 'errored' }
        }

        try {
          await fs.writeFile(ogImageFilePathFullName, pngBuffer, 'binary')
        }
        catch (err) {
          console.error(`${red('✗')} open graph image rendered successfully, but failed to write generated open graph image on path [${relative(siteConfig.root, ogImageFilePathFullName)}] due to ${err}`, `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`)
          return { status: 'errored' }
        }

        const html = await fs.readFile(file, 'utf-8')

        const result = await unified()
          .use(RehypeParse)
          .use(RehypeMeta, {
            og: true,
            name: siteTitle,
            description: siteDescription,
            image: {
              url: `${options.domain}/${encodeURIComponent(relative(siteConfig.outDir, ogImageFilePathFullName))}`,
            },
          })
          .use(RehypeStringify)
          .process(html)

        try {
          await fs.writeFile(file, String(result), 'utf-8')
        }
        catch (err) {
          console.error(`${red('✗')} failed to write transformed HTML on path [${relative(siteConfig.root, file)}] due to ${err}`, `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`)
          return { status: 'errored' }
        }

        return { status: 'success' }
      }))

      const successCount = generatedForFiles.filter(item => item.status === 'success').length
      const skippedCount = generatedForFiles.filter(item => item.status === 'skipped').length
      const erroredCount = generatedForFiles.filter(item => item.status === 'errored').length

      return `${green(`${successCount} generated`)}, ${yellow(`${skippedCount} skipped`)}, ${red(`${erroredCount} errored`)}`
    })
  }
}
