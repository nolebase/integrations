import type { SiteConfig } from 'vitepress'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { applyCategoryText, applyCategoryTextWithFallback, tryToLocateFontFile, tryToLocateTemplateSVGFile } from './options'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('tryToLocateTemplateSVGFile', () => {
  it('should return the correct file path', async () => {
    const res = await tryToLocateTemplateSVGFile({ srcDir: './' } as SiteConfig, undefined)
    expect(res).toBe(join(__dirname, 'assets', 'og-template.svg'))
  })
})

describe('tryToLocateFontFile', () => {
  it('should return the correct file path', async () => {
    const res = await tryToLocateFontFile({ srcDir: './' } as SiteConfig)
    expect(res).toBe(join(__dirname, 'assets', 'SourceHanSansSC.otf'))
  })
})

describe('applyCategoryText', () => {
  it('should return undefined when no category options', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix/title.md',
      normalizedSourceFilePath: './title.md',
      frontmatter: {},
    })
    expect(res).toBeUndefined()
  })

  it('should return level 1 path prefix', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix/title.md',
      normalizedSourceFilePath: './path-prefix/title.md',
      frontmatter: {},
    }, { byLevel: 1 })
    expect(res).toBe('path-prefix')
  })

  it('should return level 2 path prefix', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      normalizedSourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      frontmatter: {},
    }, { byLevel: 2 })
    expect(res).toBe('path-prefix-level-2')
  })

  it('should return by custom getter', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      normalizedSourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      frontmatter: {},
    }, {
      byCustomGetter: async () => {
        return 'Custom Getter'
      },
    })
    expect(res).toBe('Custom Getter')
  })

  it('should return by path prefixes definitions', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      normalizedSourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      frontmatter: {},
    }, {
      byPathPrefix: [
        { prefix: './path-prefix-level-1/path-prefix-level-2', text: 'Level 2' },
        { prefix: './path-prefix-level-1', text: 'Level 1' },
      ],
    })
    expect(res).toBe('Level 2')
  })

  it('should return by path prefixes definitions with orders', async () => {
    const res = await applyCategoryText({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      normalizedSourceFilePath: './path-prefix-level-1/path-prefix-level-2/title.md',
      frontmatter: {},
    }, {
      byPathPrefix: [
        { prefix: './path-prefix-level-1', text: 'Level 1' },
        { prefix: './path-prefix-level-1/path-prefix-level-2', text: 'Level 2' },
      ],
    })
    expect(res).toBe('Level 1')
  })
})

describe('applyCategoryTextWithFallback', () => {
  it('should return frontmatter category text', async () => {
    const res = await applyCategoryTextWithFallback({
      title: 'title',
      category: 'some-category',
      locale: 'en',
      sourceFilePath: './path-prefix/title.md',
      normalizedSourceFilePath: './title.md',
      frontmatter: { category: 'Fallback' },
    }, {
      fallbackWithFrontmatter: true,
    })

    expect(res).toBe('Fallback')
  })
})
