import type { HeadConfig, TransformContext } from 'vitepress'

import { unified } from 'unified'
import RehypeParse from 'rehype-parse'
import { select } from 'hast-util-select'
import type { Nodes } from 'hast'
import { toText } from 'hast-util-to-text'
import { fromText } from 'hast-util-from-text'
import RetextStringify from 'retext-stringify'
import { defu } from 'defu'

function RehypeRetext(option: { selector: string }): (tree: Nodes) => void {
  return (nodes) => {
    const vpDocElement = select(option.selector, nodes)
    if (!vpDocElement)
      return

    const text = toText(vpDocElement)
    fromText(nodes, text)
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
   * Whether to use the tagline from the frontmatter for the home layout.
   */
  useTaglineForHomeLayout?: boolean
  /**
   * Handle the excerpt before adding it to the head.
   */
  handleExcerpt?: (excerpt: string, context: Readonly<TransformContext>) => Promise<string>
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

export function transformHeadMeta(options?: TransformHeadMetaOptions): (head: HeadConfig[], context: Readonly<TransformContext>) => Promise<HeadConfig[] | void> {
  const opts = defu(options, {
    length: 200,
    selectorForContent: '#VPContent div.content main .vp-doc div',
    useTaglineForHomeLayout: true,
  })

  return async (head: HeadConfig[], context: Readonly<TransformContext>) => {
    const result = (await unified()
      .data({ settings: { fragment: true } })
      .use(RehypeParse)
      .use(RehypeRetext, { selector: opts.selectorForContent })
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

    head = updateMetaOrCreateMeta(head, 'name', 'description', excerpt)
    head = updateMetaOrCreateMeta(head, 'property', 'og:description', excerpt)
    head = updateMetaOrCreateMeta(head, 'property', 'twitter:description', excerpt)

    return head
  }
}
