import type { Nodes } from 'hast'
import type { HeadConfig, TransformContext } from 'vitepress'

import RehypeParse from 'rehype-parse'
import RetextStringify from 'retext-stringify'

import { defu } from 'defu'
import { select, selectAll } from 'hast-util-select'
import { toText } from 'hast-util-to-text'
import { unified } from 'unified'
import { remove } from 'unist-util-remove'
import { removePosition } from 'unist-util-remove-position'

function RehypeRetext(option: { selector: string, removeSelectors: string[] }): (tree: Nodes) => void {
  return (nodes) => {
    const vpDocElement = select(option.selector, nodes)
    if (!vpDocElement)
      return
    if (vpDocElement.children.length === 0)
      return

    for (const selector of option.removeSelectors) {
      const elements = selectAll(selector, vpDocElement)
      if (elements)
        remove(vpDocElement, elements)
    }

    removePosition(vpDocElement)
    if (nodes.type !== 'root' && nodes.type !== 'element')
      return

    const text = toText(vpDocElement)
      .replaceAll(/(\n){2,}/g, ' ')

    nodes.children = [{ type: 'text', value: text }]
  }
}

interface TransformHeadMetaOptions {
  /**
   * Max length of the excerpt in characters for the meta description.
   *
   * @default 200
   */
  length?: number
  /**
   * CSS selector for the content element.
   *
   * @default '#VPContent div.content main .vp-doc div'
   */
  contentSelector?: string
  /**
   * CSS selector for the content element to remove.
   *
   * @default ['h1','.nolebase-page-properties-container']
   */
  removeContentSelector?: string[]
  /**
   * Whether to use the tagline from the frontmatter for the home layout.
   */
  useTaglineForHomeLayout?: boolean
  /**
   * Handle the excerpt before adding it to the head.
   */
  handleExcerpt?: (excerpt: string, context: Readonly<TransformContext>) => Promise<string>
}

function getMeta(head: HeadConfig[], fromKey: string, withValue: string): HeadConfig | undefined {
  return head.find(([key, attrs]) => key === 'meta' && attrs[fromKey] === withValue)
}

function updateMetaOrCreateMeta(head: HeadConfig[], fromKey: string, withValue: string, asContent: string): HeadConfig[] {
  const meta = head.find(([key, attrs]) => key === 'meta' && attrs[fromKey] === withValue)
  if (meta) {
    meta[1].content = asContent
    return head
  }

  head.push(['meta', { [fromKey]: withValue, content: asContent }])
  return head
}

export function transformHeadMeta(options?: TransformHeadMetaOptions): (head: HeadConfig[], context: TransformContext) => Promise<HeadConfig[] | void> {
  const opts = defu(options, {
    length: 200,
    contentSelector: '#VPContent div.content main .vp-doc div',
    removeContentSelector: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      '.vp-nolebase-page-properties-container',
      '.vp-nolebase-git-changelog-history-container',
      '.vp-nolebase-git-changelog-contributors-container',
    ],
    useTaglineForHomeLayout: true,
  })

  return async (head: HeadConfig[], context: Readonly<TransformContext>) => {
    const result = (await unified()
      .data({ settings: { fragment: true } })
      .use(RehypeParse)
      .use(RehypeRetext, {
        selector: opts.contentSelector,
        removeSelectors: opts.removeContentSelector,
      })
      .use(RetextStringify)
      .process(context.content))
      .toString()

    let excerpt = result.slice(0, opts.length).trim()
    // if result is longer than 200 characters, add ellipsis
    if (result.length > opts.length)
      excerpt += '...'

    if (context.pageData.frontmatter?.layout === 'home' && opts.useTaglineForHomeLayout)
      excerpt = context.pageData.frontmatter?.hero?.tagline ?? context.siteConfig.site.description
    if (opts.handleExcerpt && typeof opts.handleExcerpt === 'function') {
      const handledResult = opts.handleExcerpt(excerpt, context)
      if (handledResult && typeof handledResult === 'string')
        excerpt = handledResult
      else if (handledResult instanceof Promise)
        excerpt = await handledResult
    }

    const ogTitle = getMeta(head, 'property', 'og:title')
    if (!ogTitle && context.pageData.title)
      head = updateMetaOrCreateMeta(head, 'property', 'og:title', context.pageData.title)

    head = updateMetaOrCreateMeta(head, 'name', 'description', excerpt)
    head = updateMetaOrCreateMeta(head, 'property', 'og:description', excerpt)
    head = updateMetaOrCreateMeta(head, 'property', 'twitter:description', excerpt)

    return head
  }
}
