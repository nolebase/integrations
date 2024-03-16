import type { Buffer } from 'node:buffer'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import fs from 'fs-extra'
import type { SiteConfig } from 'vitepress'
import { gray, green, red } from 'colorette'
import { unified } from 'unified'
import RehypeMeta from 'rehype-meta'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'

import { removeEmoji } from '../emoji'
import { getDescriptionWithLocales, getTitleWithLocales } from '../vitepress/locales'
import type { TaskResult } from '../task'
import type { PageItem } from '../../types'
import { escape } from './escape'

function templateSVG(siteName: string, siteDescription: string, title: string, category: string, ogTemplate: string): string {
  // Remove emoji and split lines
  const lines = removeEmoji(title)
    .trim()
    .replace(/(?![^\n]{1,17}$)([^\n]{1,17})\s/g, '$1\n')
    .split('\n')

  // Restricted 17 words per line
  lines.forEach((val, i) => {
    if (val.length > 17) {
      lines[i] = val.slice(0, 17)
      lines[i + 1] = `${val.slice(17)}${lines[i + 1] || ''}`
    }
    lines[i] = lines[i].trim()
  })

  const categoryStr = category ? removeEmoji(category).trim() : ''

  const data = {
    siteName,
    siteDescription,
    category: categoryStr,
    line1: lines[0] || '',
    line2: lines[1] || '',
    line3: `${lines[2] || ''}${lines[3] ? '...' : ''}`,
  }

  return ogTemplate.replace(/\{\{([^}]+)}}/g, (_, name) => {
    if (!name || typeof name !== 'string' || !(name in data))
      return ''

    const nameKeyOf = name as keyof typeof data
    return escape(data[nameKeyOf])
  })
}

export async function renderSVG(svgContent: string, options?: { fontPath?: string }): Promise<Buffer> {
  let resvg: Resvg

  try {
    resvg = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: 1200 },
      font: {
        fontFiles: options?.fontPath ? [options.fontPath] : [],
        // Load system fonts might cost more time
        loadSystemFonts: false,
      },
    })
  }
  catch (err) {
    throw new Error(`Failed to initiate Resvg instance to render open graph images due to ${err}`)
  }

  try {
    return resvg.render().asPng()
  }
  catch (err) {
    throw new Error(`Failed to render open graph images on path due to ${err}`)
  }
}

async function renderSVGAndSavePNG(svgContent: string, saveAs: string, forSvgSource: string, forFile: string, options: {
  fontPath?: string
}) {
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

export async function tryToLocateTemplateSVGFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const templateSvgPathUnderPublicDir = resolve(siteConfig.root, 'public', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderPublicDir))
    return templateSvgPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const templateSvgPathUnderRootDir = resolve(__dirname, '..', '..', 'assets', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderRootDir))
    return templateSvgPathUnderRootDir

  return undefined
}

async function tryToLocateFontFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const fontPathUnderPublicDir = resolve(siteConfig.root, 'public', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderPublicDir))
    return fontPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const fontPathUnderRootDir = resolve(__dirname, '..', '..', 'assets', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderRootDir))
    return fontPathUnderRootDir

  return undefined
}

/**
 * Render SVG and rewrite HTML
 * @param {SiteConfig} siteConfig - Site configuration
 * @param {PageItem} page - Page item
 * @param {string} file - File path
 * @param {string} ogImageTemplateSvg - Open Graph image template SVG
 * @param {string} ogImageTemplateSvgPath - Open Graph image template SVG path
 * @param {string} domain - Domain
 * @returns {Promise<TaskResult>} Task result
 */
export async function renderSVGAndRewriteHTML(siteConfig: SiteConfig, page: PageItem, file: string, ogImageTemplateSvg: string, ogImageTemplateSvgPath: string, domain: string): Promise<TaskResult> {
  const siteTitle = getTitleWithLocales(siteConfig.site, page.locale)
  const siteDescription = getDescriptionWithLocales(siteConfig.site, page.locale)

  const ogImageFilePathBaseName = `og-${page.text || 'Untitled'}.png`
  const ogImageFilePathFullName = `${dirname(file)}/${ogImageFilePathBaseName}`
  const templatedOgImageSvg = templateSVG(siteTitle, siteDescription, page.text, page.category ?? '', ogImageTemplateSvg)

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
