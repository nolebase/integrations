import type { PluginWithOptions } from 'markdown-it'

import { ElementTransform } from '@nolebase/markdown-it-element-transform'

export const InlineLinkPreviewElementTransform: PluginWithOptions<{ tag: string } | null | undefined> = (md, options) => {
  const tagName = options?.tag || 'VPNolebaseInlineLinkPreview'

  md.use(ElementTransform, (() => {
    let transformNextLinkCloseToken = false
    let transformNextHtmlInlineCloseToken = false

    return {
      transform(token) {
        switch (token.type) {
          case 'html_inline':
            if (/<a.*data-inline-link-preview="false".*>/.test(token.content))
              return

            if (/<a.*class="header-anchor"|".* header-anchor"|"header-anchor .*"|".* header-anchor [^\n\r"\u2028\u2029]*".*>/.test(token.content))
              return

            if (/<a.*class="no-inline-link-preview"|".* no-inline-link-preview"|"no-inline-link-preview .*"|".* no-inline-link-preview [^\n\r"\u2028\u2029]*".*>/.test(token.content))
              return

            if (!transformNextHtmlInlineCloseToken && /<a/.test(token.content)) {
              token.content = token.content.replace(/<a/, `<${tagName}`)
              transformNextHtmlInlineCloseToken = true
            }
            else if (transformNextHtmlInlineCloseToken && /<\/a/.test(token.content)) {
              token.content = token.content.replace(/<\/a/, `</${tagName}`)
              transformNextHtmlInlineCloseToken = false
            }

            break
          case 'link_open':
            if (!token.attrGet('href'))
              return

            if (token.attrGet('class')?.includes('header-anchor'))
              return

            if (token.attrGet('class')?.includes('no-inline-link-preview'))
              return

            if (token.attrGet('data-inline-link-preview') === 'false')
              return

            token.tag = tagName
            transformNextLinkCloseToken = true

            break
          case 'link_close':
            if (!transformNextLinkCloseToken)
              return

            token.tag = tagName
            transformNextLinkCloseToken = false

            break
        }
      },
    }
  })())
}
