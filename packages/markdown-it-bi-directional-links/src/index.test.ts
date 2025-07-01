import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import MarkdownIt from 'markdown-it'

import { describe, expect, it } from 'vitest'

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

  it('should render simple form for images', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('![[foo.png]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt=""></p>\n')
  })

  it('should render simple form for images without attachment markup', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt=""></p>\n')
  })

  it('should render simple form for audio', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('![[foo.mp3]]')

    expect(rendered).toBe('<p><audio controls="true" preload="metadata"><source src="/foo.mp3"></audio></p>\n')
  })

  it('should render simple form for audio without attachment markup', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.mp3]]')

    expect(rendered).toBe('<p><audio controls="true" preload="metadata"><source src="/foo.mp3"></audio></p>\n')
  })

  it('should render simple form for videos', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('![[foo.mp4]]')

    expect(rendered).toBe('<p><video controls="true" preload="metadata"><source src="/foo.mp4"></video></p>\n')
  })

  it('should render simple form for videos without attachment markup', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.mp4]]')

    expect(rendered).toBe('<p><video controls="true" preload="metadata"><source src="/foo.mp4"></video></p>\n')
  })

  it('should render simple form with custom texts', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo|bar]]')

    expect(rendered).toBe('<p><a href="/foo.md">bar</a></p>\n')
  })

  it('should render simple form for images with custom alt', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('![[foo.png|alt text]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="alt text"></p>\n')
  })

  it('should render simple form for images with custom alt without attachment markup', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|alt text]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="alt text"></p>\n')
  })

  it('image size', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|300x200]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="" width="300" height="200"></p>\n')
  })

  it('image size, without height', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|300]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="" width="300"></p>\n')
  })

  it('image size, with zero height', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|300x0]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="" width="300"></p>\n')
  })

  it('image size, with zero width', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|0x200]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="" height="200"></p>\n')
  })

  it('image size, with alt', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render('[[foo.png|alt text|300x200]]')

    expect(rendered).toBe('<p><img src="/foo.png" alt="alt text" width="300" height="200"></p>\n')
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

  it('should render when without "foo" 1', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[#bar]]`)

    expect(rendered).toBe(`<p><a href="#bar">bar</a></p>\n`)
  })

  it('should render when without "foo" 2', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[^bar]]`)

    expect(rendered).toBe(`<p><a href="#^bar">bar</a></p>\n`)
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

  it('should skip rendering when no matched files', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir }))
      .render(`[[some random words]]`)

    expect(rendered).toBe(`<p>[[some random words]]</p>\n`)
  })

  it('should skip rendering with no logs when no matched files', () => {
    const rendered = new MarkdownIt({ html: true })
      .use(BiDirectionalLinks({ dir: testdataDir, noNoMatchedFileWarning: true }))
      .render(`[[some random words]]`)

    expect(rendered).toBe(`<p>[[some random words]]</p>\n`)
  })
})
