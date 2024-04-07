import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'

import { BiDirectionalLinks } from '.'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('markdown-it-bi-directional-links', () => {
  const testdataDir = join(__dirname, 'testdata')

  it('should render simple form', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo]]')

    expect(rendered).toBe('<p><a href="/foo.md">foo</a></p>\n')
  })

  it('should render simple form with custom texts', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo|bar]]')

    expect(rendered).toBe('<p><a href="/foo.md">bar</a></p>\n')
  })

  it('should render simple form with custom html texts', () => {
    const inlineHTML = `<span style="color: red;">Custom HTML (Before)</span> Middle <span style="color: blue;">Custom HTML (After)</span>`

    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[foo|${inlineHTML}]]`)

    expect(rendered).toBe(`<p><a href="/foo.md">${inlineHTML}</a></p>\n`)
  })

  it('should render simple form with hash tags', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[foo#bar]]`)

    expect(rendered).toBe(`<p><a href="/foo.md#bar">foo</a></p>\n`)
  })

  it('should render multi-words form with hash tags', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[foo bar#bar]]`)

    expect(rendered).toBe(`<p><a href="/foo bar.md#bar">foo bar</a></p>\n`)
  })

  it('should render simple form with query strings', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[foo?bar=baz]]`)

    expect(rendered).toBe(`<p><a href="/foo.md?bar=baz">foo</a></p>\n`)
  })

  it('should render multi-words form with query strings', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[foo bar?bar=baz]]`)

    expect(rendered).toBe(`<p><a href="/foo bar.md?bar=baz">foo bar</a></p>\n`)
  })
})
