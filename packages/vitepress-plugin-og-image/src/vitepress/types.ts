import type { Buffer } from 'node:buffer'

import type { DefaultTheme } from 'vitepress'

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
   *
   * @default 1200
   */
  resultImageWidth?: number

  /**
   * Maximum characters per line.
   *
   * @default 17
   */
  maxCharactersPerLine?: number
  /**
   * Whether to override existing meta tags.
   *
   * @default true
   */
  overrideExistingMetaTags?: boolean
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
  byCustomGetter?: (page: PageItem) => string | void | Promise<string | void>
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

export interface PageItem extends DefaultTheme.SidebarItem {
  title: string
  category: string
  locale: string
  sourceFilePath: string
  normalizedSourceFilePath: string
  frontmatter: Record<string, any>
}
