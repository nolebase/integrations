import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { sep as posixSep } from 'node:path/posix'
import { fileURLToPath } from 'node:url'
import type { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import { glob } from 'glob'
import type { DefaultTheme, SiteConfig } from 'vitepress'
import { cyan, gray, green, red, yellow } from 'colorette'
import GrayMatter from 'gray-matter'
import { unified } from 'unified'
import RehypeMeta from 'rehype-meta'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

import { flattenSidebar, getSidebar } from './utils/vitepress/sidebar'
import { type TaskResult, renderTaskResultsSummary, task } from './utils/task'
import type { PageItem } from './types'
import { getDescriptionWithLocales, getTitleWithLocales } from './utils/vitepress/locales'
import { initFontBuffer, initSVGRenderer, renderSVG, templateSVG } from './utils/svg/render'

const logModulePrefix = `${cyan(`@nolebase/vitepress-plugin-og-image`)}${gray(':')}`

async function tryToLocateTemplateSVGFile(siteConfig: SiteConfig, configTemplateSvgPath?: string): Promise<string | undefined> {
  if (configTemplateSvgPath != null)
    return resolve(siteConfig.srcDir, configTemplateSvgPath)

  const templateSvgPathUnderPublicDir = resolve(siteConfig.srcDir, 'public', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderPublicDir))
    return templateSvgPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const templateSvgPathUnderRootDir = resolve(__dirname, 'assets', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderRootDir))
    return templateSvgPathUnderRootDir

  return undefined
}

async function tryToLocateFontFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const fontPathUnderPublicDir = resolve(siteConfig.srcDir, 'public', 'SourceHanSansSC.otf')
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
 *
 * Will always save the rendered Open Graph image as PNG under the same directory as the HTML file with
 * the name `og-${fileName of rendered HTML}.png`.
 *
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
  imageUrlResolver: BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver'],
  additionalFontBuffers?: Buffer[],
  resultImageWidth?: number,
  maxCharactersPerLine?: number,
): Promise<TaskResult> {
  const fileName = basename(file, '.html')
  const ogImageFilePathBaseName = `og-${fileName}.png`
  const ogImageFilePathFullName = `${dirname(file)}/${ogImageFilePathBaseName}`

  const html = await fs.readFile(file, 'utf-8')
  const parsedHtml = unified()
    .use(RehypeParse, { fragment: true })
    .parse(html)

  let hasOgImage: string | false = false
  visit(parsedHtml, 'element', (node) => {
    if (node.tagName === 'meta' && (node.properties?.name === 'og:image' || node.properties?.name === 'twitter:image'))
      hasOgImage = node.properties.name
    else
      return true
  })

  if (hasOgImage) {
    return {
      filePath: file,
      status: 'skipped',
      reason: `already has ${hasOgImage} meta tag`,
    }
  }

  const templatedOgImageSvg = templateSVG(
    siteTitle,
    siteDescription,
    page.title,
    page.category ?? '',
    ogImageTemplateSvg,
    maxCharactersPerLine,
  )

  let width: number
  let height: number
  try {
    const res = await renderSVGAndSavePNG(
      templatedOgImageSvg,
      ogImageFilePathFullName,
      ogImageTemplateSvgPath,
      relative(siteConfig.srcDir, file),
      { fontPath: await tryToLocateFontFile(siteConfig), imageUrlResolver, additionalFontBuffers, resultImageWidth },
    )
    width = res.width
    height = res.height
  }
  catch (err) {
    return {
      filePath: file,
      status: 'errored',
      reason: String(err),
    }
  }

  const result = await unified()
    .use(RehypeParse)
    .use(RehypeMeta, {
      og: true,
      twitter: true,
      image: {
        url: `${domain}/${
          relative(siteConfig.outDir, ogImageFilePathFullName)
            .split(sep)
            .map(item => encodeURIComponent(item))
            .join('/')
        }`,
        width,
        height,
      },
    })
    .use(RehypeStringify)
    .process(html)

  try {
    await fs.writeFile(file, String(result), 'utf-8')
  }
  catch (err) {
    console.error(
      `${logModulePrefix} `,
      `${red('[ERROR] ✗')} failed to write transformed HTML on path [${relative(siteConfig.srcDir, file)}] due to ${err}`,
      `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`,
    )
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
    imageUrlResolver?: BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver']
    additionalFontBuffers?: Buffer[]
    resultImageWidth?: number
  },
) {
  try {
    const { png: pngBuffer, width, height } = await renderSVG(svgContent, await initFontBuffer(options), options.imageUrlResolver, options.additionalFontBuffers, options.resultImageWidth)

    try {
      await fs.writeFile(saveAs, pngBuffer, 'binary')
    }
    catch (err) {
      console.error(
        `${logModulePrefix} `,
        `${red('[ERROR] ✗')} open graph image rendered successfully, but failed to write generated open graph image on path [${saveAs}] due to ${err}`,
        `\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`,
      )

      throw err
    }

    return {
      width,
      height,
    }
  }
  catch (err) {
    console.error(
      `${logModulePrefix} `,
      `${red('[ERROR] ✗')} failed to generate open graph image as ${green(`[${saveAs}]`)} with ${green(`[${forSvgSource}]`)} due to ${red(String(err))}`,
      `skipped open graph image generation for ${green(`[${forFile}]`)}`,
      `\n\nSVG Content:\n\n${svgContent}`,
      `\n\nDetailed stack information bellow:\n\n${red((err as Error).message)}\n${gray(String((err as Error).stack))}`,
    )

    throw err
  }
}

export interface BuildEndGenerateOpenGraphImagesOptions {
  /**
   * The base URL to use for open graph image.
   *
   * Must be a full URL, e.g. `https://example.com` or `https://example.com/path/of/baseUrl`.
   *
   * This is because for platforms like Telegram, Twitter, and Facebook, they wouldn't accept
   * relative URLs for open graph image when dynamically fetching the image from the HTML meta tag.
   * Instead, they require a full URL to the image.
   *
   * If you would ever need to use a dynamic base URL (e.g. Cloudflare Pages, Vercel, Netlify staging
   * preview URL), you may need to create a separate stabled sub-domain or use a standalone services
   * S3 to host the generated open graph images to make sure the image URL is full with domain.
   */
  baseUrl: string
  /**
   * The category options to use for open graph image.
   */
  category?: BuildEndGenerateOpenGraphImagesOptionsCategory

  /**
   * This function will be called with each URL of the image hrefs in the SVG template.
   * You can return a Buffer of the image to use to avoid fetching the image from its URL.
   * If you return undefined, the image will be fetched from its URL.
   */
  svgImageUrlResolver?: (imageUrl: string) => Promise<Buffer> | Buffer | undefined

  /**
   * Font buffers to load for rendering the template SVG
   */
  svgFontBuffers?: Buffer[]

  /**
   * Temaplte SVG file path.
   * If not supplied, will try to locate `og-template.svg` under `public` or `assets` directory,
   * and will fallback to a builtin template.
   */
  templateSvgPath?: string

  /**
   * Width of the result image.
   * Defaults to `1200`.
   */
  resultImageWidth?: number

  /**
   * Maximum characters per line.
   * Defaults to `17`.
   */
  maxCharactersPerLine?: number
}

export interface BuildEndGenerateOpenGraphImagesOptionsCategory {
  /**
   * Automatically extract category text from path with a specific level.
   *
   * For example, if you have a path like `/foo/bar/baz/index.md`, and you set `byLevel` to `1`,
   * the category text will be `bar`. This is extremely useful when you have a file based routing,
   * while having all the contents organized in a stable directory structure (e.g. knowledge base).
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   */
  byLevel?: number
  /**
   * Automatically extract category text from path with a specific prefix.
   *
   * For example, if you have a path like `/foo/bar/baz/index.md`, and you set `byPathPrefix` to `[{ prefix: 'foo', text: 'Foo' }]`,
   * the category text will be `Foo`. This is extremely useful when you use file based routing, while organized the contents
   * inside a directory name that friendly to browsers.
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   */
  byPathPrefix?: {
    /**
     * The prefix to match.
     */
    prefix: string
    /**
     * The text to use as category.
     */
    text: string
  }[]
  /**
   * If `byLevel` or `byPathPrefix` is not enough, you can provide a custom getter to extract category text programmatically.
   *
   * For example you have a complex i18n system, or you want to extract category text from a specific field in frontmatter.
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   *
   * @param {PageItem} page - The page item to process
   * @returns {string} The category text
   */
  byCustomGetter?: (page: PageItem) => string | undefined | Promise<string | undefined>
  /**
   * Fallback to frontmatter category text when no category text found.
   *
   * Only effective when no category text found from `byLevel`, `byPathPrefix`, or `byCustomGetter`, or none of them
   * were provided. If `true`, it will fallback to frontmatter category text when no category text found. Otherwise a 'Un-categorized'
   * will be used as category text.
   *
   * @default true
   */
  fallbackWithFrontmatter?: boolean
}

async function applyCategoryText(pageItem: PageItem, categoryOptions?: BuildEndGenerateOpenGraphImagesOptionsCategory): Promise<string | undefined> {
  if (typeof categoryOptions?.byCustomGetter !== 'undefined') {
    const gotTextMaybePromise = categoryOptions.byCustomGetter({ ...pageItem })

    if (typeof gotTextMaybePromise === 'undefined')
      return undefined

    if (gotTextMaybePromise instanceof Promise)
      return await gotTextMaybePromise

    if (gotTextMaybePromise)
      return gotTextMaybePromise

    return undefined
  }

  if (typeof categoryOptions?.byPathPrefix !== 'undefined') {
    for (const { prefix, text } of categoryOptions.byPathPrefix) {
      if (pageItem.normalizedSourceFilePath.startsWith(prefix)) {
        if (!text) {
          console.warn(
            `${logModulePrefix} ${yellow('[WARN]')} empty text for prefix ${prefix} when processing ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
          )
          return undefined
        }

        return text
      }
      if (pageItem.normalizedSourceFilePath.startsWith(`/${prefix}`)) {
        if (!text) {
          console.warn(
            `${logModulePrefix} ${yellow('[WARN]')} empty text for prefix ${prefix} when processing ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
          )
          return undefined
        }

        return text
      }
    }

    console.warn(
      `${logModulePrefix} ${yellow('[WARN]')} no path prefix matched for ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
    )
    return undefined
  }

  if (typeof categoryOptions?.byLevel !== 'undefined') {
    const level = Number.parseInt(String(categoryOptions?.byLevel ?? 0))
    if (Number.isNaN(level)) {
      console.warn(
        `${logModulePrefix} ${yellow('[ERROR]')} byLevel must be a number, but got ${categoryOptions.byLevel} instead when processing ${pageItem.sourceFilePath} with categoryOptions.byLevel, will ignore...`,
      )
      return undefined
    }

    const dirs = pageItem.sourceFilePath.split(sep)
    if (dirs.length > level)
      return dirs[level]

    console.warn(`${logModulePrefix} ${red(`[ERROR] byLevel is out of range for ${pageItem.sourceFilePath} with categoryOptions.byLevel.`)} will ignore...`)
    return undefined
  }

  return undefined
}

async function applyCategoryTextWithFallback(pageItem: PageItem, categoryOptions?: BuildEndGenerateOpenGraphImagesOptionsCategory): Promise<string> {
  const customText = await applyCategoryText(pageItem, categoryOptions)
  if (customText)
    return customText

  const fallbackWithFrontmatter = typeof categoryOptions?.fallbackWithFrontmatter === 'undefined'
    ? true
    : categoryOptions.fallbackWithFrontmatter

  if (fallbackWithFrontmatter
    && 'category' in pageItem.frontmatter
    && pageItem.frontmatter.category
    && typeof pageItem.frontmatter.category === 'string'
  ) {
    return (pageItem.frontmatter as { category?: string }).category ?? ''
  }

  console.warn(`${logModulePrefix} ${yellow('[WARN]')} no category text found for ${pageItem.sourceFilePath} with categoryOptions ${JSON.stringify(categoryOptions)}.}`)
  return 'Un-categorized'
}

/**
 * Build end generate open graph images.
 * @param {BuildEndGenerateOpenGraphImagesOptions} options - Options used for generating open graph images.
 * @returns Build end hook for VitePress
 */
export function buildEndGenerateOpenGraphImages(options: BuildEndGenerateOpenGraphImagesOptions) {
  return async (siteConfig: SiteConfig) => {
    await initSVGRenderer()

    const ogImageTemplateSvgPath = await tryToLocateTemplateSVGFile(siteConfig, options.templateSvgPath)

    await task('rendering open graph images', async (): Promise<string | undefined> => {
      const themeConfig = siteConfig.site.themeConfig as unknown as DefaultTheme.Config
      const sidebar = getSidebar(siteConfig.site, themeConfig)

      // Flatten sidebar
      let pages: PageItem[] = []

      for (const locale of sidebar.locales) {
        const flattenedSidebar = flattenSidebar(sidebar.sidebar[locale])
        const items: PageItem[] = []

        for (const item of flattenedSidebar) {
          const relativeLink = item.link ?? ''
          const sourceFilePath = relativeLink.endsWith('/')
            ? `${relativeLink}index.md`
            : relativeLink.endsWith('.md')
              ? relativeLink
              : `${relativeLink}.md`

          const sourceFileContent = fs.readFileSync(`${join(siteConfig.srcDir, sourceFilePath)}`, 'utf-8')
          const { data } = GrayMatter(sourceFileContent)
          const res: PageItem = {
            ...item,
            title: item.text ?? (item as any).title ?? 'Untitled',
            category: '',
            locale,
            frontmatter: data,
            sourceFilePath,
            normalizedSourceFilePath: sourceFilePath.split(sep).join(posixSep),
          }

          res.category = await applyCategoryTextWithFallback(res, options.category)

          items.push(res)
        }

        pages = pages.concat(items)
      }

      const files = await glob(`${siteConfig.outDir}/**/*.html`, { nodir: true })

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
          let itemLink = item.link
          if (itemLink?.endsWith('.md'))
            itemLink = itemLink.slice(0, -'.md'.length)

          if (itemLink === link)
            return true

          if (itemLink === `${link}/`)
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
          options.baseUrl,
          options.svgImageUrlResolver,
          options.svgFontBuffers,
          options.resultImageWidth,
          options.maxCharactersPerLine,
        )
      }))

      return renderTaskResultsSummary(generatedForFiles, siteConfig)
    })
  }
}
