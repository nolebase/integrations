import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { DefaultTheme, SiteConfig } from 'vitepress'
import { gray, green, red, yellow } from 'colorette'
import GrayMatter from 'gray-matter'
import { unified } from 'unified'
import RehypeMeta from 'rehype-meta'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'

import { flattenSidebar, getSidebar } from './utils/vitepress/sidebar'
import { type TaskResult, renderTaskResultsSummary, task } from './utils/task'
import type { PageItem } from './types'
import { getDescriptionWithLocales, getTitleWithLocales } from './utils/vitepress/locales'
import { renderSVG, templateSVG } from './utils/svg/render'

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

/**
 * Render SVG and rewrite HTML
 * @param {SiteConfig} siteConfig - Site configuration
 * @param {string} siteTitle - Site title
 * @param {string} siteDescription - Site description
 * @param {PageItem} page - Page item
 * @param {string} file - File path
 * @param {string} ogImageTemplateSvg - Open Graph image template SVG
 * @param {string} ogImageTemplateSvgPath - Open Graph image template SVG path
 * @param {string} domain - Domain
 * @returns {Promise<TaskResult>} Task result
 */
async function renderSVGAndRewriteHTML(
  siteConfig: SiteConfig,
  siteTitle: string,
  siteDescription: string,
  page: PageItem,
  file: string,
  ogImageTemplateSvg: string,
  ogImageTemplateSvgPath: string,
  domain: string,
): Promise<TaskResult> {
  const ogImageFilePathBaseName = `og-${page.title}.png`
  const ogImageFilePathFullName = `${dirname(file)}/${ogImageFilePathBaseName}`
  const templatedOgImageSvg = templateSVG(
    siteTitle,
    siteDescription,
    page.title,
    page.category ?? '',
    ogImageTemplateSvg,
  )

  try {
    await renderSVGAndSavePNG(
      templatedOgImageSvg,
      ogImageFilePathFullName,
      ogImageTemplateSvgPath,
      relative(siteConfig.root, file),
      { fontPath: await tryToLocateFontFile(siteConfig) },
    )
  }
  catch (err) {
    return {
      filePath: file,
      status: 'errored',
      reason: String(err),
    }
  }

  const html = await fs.readFile(file, 'utf-8')

  const result = await unified()
    .use(RehypeParse)
    .use(RehypeMeta, {
      og: true,
      twitter: true,
      name: siteTitle,
      description: siteDescription,
      image: {
        url: `${domain}/${encodeURIComponent(relative(siteConfig.outDir, ogImageFilePathFullName))}`,
      },
    })
    .use(RehypeStringify)
    .process(html)

  try {
    await fs.writeFile(file, String(result), 'utf-8')
  }
  catch (err) {
    console.error(`${red('✗')} failed to write transformed HTML on path [${relative(siteConfig.root, file)}] due to ${err}`, `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`)
    return {
      filePath: file,
      status: 'errored',
      reason: String(err),
    }
  }

  return {
    filePath: file,
    status: 'success',
  }
}

async function renderSVGAndSavePNG(
  svgContent: string,
  saveAs: string,
  forSvgSource: string,
  forFile: string,
  options: {
    fontPath?: string
  },
) {
  let pngBuffer: Buffer

  try {
    pngBuffer = await renderSVG(svgContent, { fontPath: options.fontPath })
  }
  catch (err) {
    console.error(
    `${red('✗')} failed to generate open graph image as ${green(`[${saveAs}]`)} with ${green(`[${forSvgSource}]`)} due to ${red(String(err))}`,
    `skipped open graph image generation for ${green(`[${forFile}]`)}`,
    `\n\nSVG Content:\n\n${svgContent}`,
    `\n\nDetailed stack information bellow:\n\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`,
    )

    throw err
  }

  try {
    await fs.writeFile(saveAs, pngBuffer, 'binary')
  }
  catch (err) {
    console.error(`${red('✗')} open graph image rendered successfully, but failed to write generated open graph image on path [${saveAs}] due to ${err}`, `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`)

    throw err
  }
}

export function buildEndGenerateOpenGraphImages(options: {
  domain: string
  category?: {
    byLevel?: number
    fallbackWithFrontmatter?: boolean
    customGetter?: (page: PageItem) => string
  }
}) {
  const fallbackWithFrontmatter = typeof options.category?.fallbackWithFrontmatter === 'undefined'
    ? true
    : options.category.fallbackWithFrontmatter

  return async (siteConfig: SiteConfig) => {
    const ogImageTemplateSvgPath = await tryToLocateTemplateSVGFile(siteConfig)

    await task('rendering open graph images', async (): Promise<string | undefined> => {
      const themeConfig = siteConfig.site.themeConfig as unknown as DefaultTheme.Config
      const sidebar = getSidebar(siteConfig.site, themeConfig)

      // Flatten sidebar
      let pages: PageItem[] = []

      for (const locale of sidebar.locales) {
        const flattenedSidebar = flattenSidebar(sidebar.sidebar[locale])

        const items = flattenedSidebar.map((item) => {
          const relativeLink = item.link ?? ''
          const sourceFilePath = relativeLink.endsWith('/')
            ? `${relativeLink}index.md`
            : `${relativeLink}.md`

          const sourceFileContent = fs.readFileSync(`${join(siteConfig.root, sourceFilePath)}`, 'utf-8')
          const { data } = GrayMatter(sourceFileContent)
          const res: PageItem = {
            ...item,
            title: item.text ?? (item as any).title ?? 'Untitled',
            category: '',
            locale,
            frontmatter: data,
            sourceFilePath,
          }

          if (typeof options.category?.customGetter !== 'undefined') {
            res.category = options.category.customGetter({ ...res })
          }
          else if (typeof options.category?.byLevel !== 'undefined') {
            const level = Number.parseInt(String(options.category?.byLevel ?? 0))

            if (!Number.isNaN(level)) {
              const dirs = res.sourceFilePath.split(sep)

              if (dirs.length > level)
                res.category = dirs[level]
            }
          }

          if (!res.category
            && fallbackWithFrontmatter
            && 'category' in res.frontmatter
            && res.frontmatter.category
            && typeof res.frontmatter.category === 'string'
          )
            res.category = (res.frontmatter as { category?: string }).category ?? ''

          if (!res.category)
            res.category = 'Un-categorized'

          return res
        }) satisfies PageItem[]

        pages = pages.concat(items)
      }

      const files = await fg(`${siteConfig.outDir}/**/*.html`, { onlyFiles: true })

      if (!ogImageTemplateSvgPath) {
        return ''
          + `${green(`${0} generated`)}, `
          + `${yellow(`${files.length} (all) skipped`)}, `
          + `${red(`${0} errored`)}.`
          + `\n\n`
          + ` - ${red('Failed to locate')} og-template.svg ${red('under public or plugin directory')}, did you forget to put it? will skip open graph image generation.`
      }

      const ogImageTemplateSvg = fs.readFileSync(ogImageTemplateSvgPath, 'utf-8')
      const generatedForFiles = await Promise.all(files.map(async (file): Promise<TaskResult> => {
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
            reason: 'correspond Markdown page not found in sidebar',
          }
        }

        const siteTitle = getTitleWithLocales(siteConfig.site, page.locale)
        const siteDescription = getDescriptionWithLocales(siteConfig.site, page.locale)

        return await renderSVGAndRewriteHTML(
          siteConfig,
          siteTitle,
          siteDescription,
          page,
          file,
          ogImageTemplateSvg,
          ogImageTemplateSvgPath,
          options.domain,
        )
      }))

      return renderTaskResultsSummary(generatedForFiles, siteConfig)
    })
  }
}
