import type { SiteConfig } from 'vitepress'

import type { BuildEndGenerateOpenGraphImagesOptionsCategory, PageItem } from './types'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import fs from 'fs-extra'

import { red, yellow } from 'colorette'

import { logModulePrefix } from './constants'

export async function tryToLocateTemplateSVGFile(siteConfig: SiteConfig, configTemplateSvgPath?: string): Promise<string | undefined> {
  if (configTemplateSvgPath != null)
    return resolve(siteConfig.srcDir, configTemplateSvgPath)

  const templateSvgPathUnderPublicDir = resolve(siteConfig.srcDir, 'public', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderPublicDir))
    return templateSvgPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const templateSvgPathUnderRootDir = resolve(__dirname, 'assets', 'og-template.svg')
  if (await fs.pathExists(templateSvgPathUnderRootDir))
    return templateSvgPathUnderRootDir
}

export async function tryToLocateFontFile(siteConfig: SiteConfig): Promise<string | undefined> {
  const fontPathUnderPublicDir = resolve(siteConfig.srcDir, 'public', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderPublicDir))
    return fontPathUnderPublicDir

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const fontPathUnderRootDir = resolve(__dirname, 'assets', 'SourceHanSansSC.otf')
  if (await fs.pathExists(fontPathUnderRootDir))
    return fontPathUnderRootDir
}

export async function applyCategoryText(pageItem: PageItem, categoryOptions?: BuildEndGenerateOpenGraphImagesOptionsCategory): Promise<string | void> {
  if (typeof categoryOptions?.byCustomGetter !== 'undefined') {
    const gotTextMaybePromise = categoryOptions.byCustomGetter({ ...pageItem })

    if (typeof gotTextMaybePromise !== 'undefined') {
      if (gotTextMaybePromise instanceof Promise)
        return await gotTextMaybePromise

      if (gotTextMaybePromise)
        return gotTextMaybePromise
    }
  }

  if (typeof categoryOptions?.byPathPrefix !== 'undefined') {
    for (const { prefix, text } of categoryOptions.byPathPrefix) {
      if (pageItem.normalizedSourceFilePath.startsWith(prefix)) {
        if (!text) {
          console.warn(
            `${logModulePrefix} ${yellow('[WARN]')} empty text for prefix ${prefix} when processing ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
          )

          return
        }

        return text
      }
      if (pageItem.normalizedSourceFilePath.startsWith(`/${prefix}`)) {
        if (!text) {
          console.warn(
            `${logModulePrefix} ${yellow('[WARN]')} empty text for prefix ${prefix} when processing ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
          )

          return
        }

        return text
      }
    }

    console.warn(
      `${logModulePrefix} ${yellow('[WARN]')} no path prefix matched for ${pageItem.sourceFilePath} with categoryOptions.byPathPrefix, will ignore...`,
    )

    return
  }

  if (typeof categoryOptions?.byLevel !== 'undefined') {
    const level = Number.parseInt(String(categoryOptions?.byLevel ?? 0))
    if (Number.isNaN(level)) {
      console.warn(
        `${logModulePrefix} ${yellow('[ERROR]')} byLevel must be a number, but got ${categoryOptions.byLevel} instead when processing ${pageItem.sourceFilePath} with categoryOptions.byLevel, will ignore...`,
      )
      return
    }

    const dirs = pageItem.sourceFilePath.split('/')
    if (dirs.length > level)
      return dirs[level]

    console.warn(`${logModulePrefix} ${red(`[ERROR] byLevel is out of range for ${pageItem.sourceFilePath} with categoryOptions.byLevel.`)} will ignore...`)
  }
}

export async function applyCategoryTextWithFallback(pageItem: PageItem, categoryOptions?: BuildEndGenerateOpenGraphImagesOptionsCategory): Promise<string> {
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
