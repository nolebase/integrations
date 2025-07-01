import type { Buffer } from 'node:buffer'

import type { DefaultTheme, SiteConfig } from 'vitepress'

import type { BuildEndGenerateOpenGraphImagesOptions, PageItem } from './types'
import type { TaskResult } from './utils/task'

import { basename, dirname, join, relative, sep } from 'node:path'
import { sep as posixSep } from 'node:path/posix'

import fs from 'fs-extra'
import GrayMatter from 'gray-matter'
import RehypeMeta from 'rehype-meta'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'

import { gray, green, red, yellow } from 'colorette'
import { defu } from 'defu'
import { glob } from 'tinyglobby'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

import { logModulePrefix } from './constants'
import { applyCategoryTextWithFallback, tryToLocateFontFile, tryToLocateTemplateSVGFile } from './options'
import { initFontBuffer, initSVGRenderer, renderSVG, templateSVG } from './utils/svg/render'
import { renderTaskResultsSummary, task } from './utils/task'
import { getDescriptionWithLocales, getTitleWithLocales } from './utils/vitepress/locales'
import { flattenSidebar, getSidebar } from './utils/vitepress/sidebar'

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
 * @param {BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver']} imageUrlResolver - SVG image URL resolver
 * @param {Buffer[]} additionalFontBuffers - Additional font buffers
 * @param {number} resultImageWidth - Result image width
 * @param {number} maxCharactersPerLine - Max characters per line
 * @param {boolean} overrideExistingMetaTags - Whether to override existing meta tags
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
  overrideExistingMetaTags?: boolean,
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

  if (hasOgImage && !overrideExistingMetaTags) {
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

/**
 * Build end generate open graph images.
 * @param {BuildEndGenerateOpenGraphImagesOptions} options - Options used for generating open graph images.
 * @returns Build end hook for VitePress
 */
export function buildEndGenerateOpenGraphImages(options: BuildEndGenerateOpenGraphImagesOptions) {
  options = defu(options, {
    resultImageWidth: 1200,
    maxCharactersPerLine: 17,
    overrideExistingMetaTags: true,
  } satisfies Omit<BuildEndGenerateOpenGraphImagesOptions, 'baseUrl'>)

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

      const files = await glob(`${siteConfig.outDir}/**/*.html`, { onlyFiles: true })

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
          options.overrideExistingMetaTags,
        )
      }))

      return renderTaskResultsSummary(generatedForFiles, siteConfig)
    })
  }
}
