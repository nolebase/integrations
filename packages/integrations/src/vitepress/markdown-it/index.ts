import type { BiDirectionalLinksOptions } from '@nolebase/markdown-it-bi-directional-links'
import type { UnlazyImagesOptions } from '@nolebase/markdown-it-unlazy-img'

import type { PresetMarkdownIt } from './types'

import { cwd } from 'node:process'

import defu from 'defu'

interface MarkdownItOptions {
  bidirectionalLinks?: | { options?: BiDirectionalLinksOptions }
  unlazyImages?: false | { options?: UnlazyImagesOptions }
  inlineLinkPreview?: false | { options?: { tag: string } }
}

export function presetMarkdownIt(options?: MarkdownItOptions): PresetMarkdownIt {
  const opts = defu<MarkdownItOptions, MarkdownItOptions[]>(options, {
    bidirectionalLinks: {
      options: {
        dir: cwd(),
      },
    },
    unlazyImages: {
      options: {
        imgElementTag: 'NolebaseUnlazyImg',
      },
    },
    inlineLinkPreview: true as any,
  })

  return {
    async install(md) {
      if (opts.bidirectionalLinks) {
        const { BiDirectionalLinks } = await import('@nolebase/markdown-it-bi-directional-links')
        md.use(BiDirectionalLinks(opts.bidirectionalLinks.options))
      }
      if (opts.unlazyImages) {
        const { UnlazyImages } = await import('@nolebase/markdown-it-unlazy-img')
        md.use(UnlazyImages(), opts.unlazyImages.options)
      }

      if (opts.inlineLinkPreview) {
        const { InlineLinkPreviewElementTransform } = await import('@nolebase/vitepress-plugin-inline-link-preview/markdown-it')
        md.use(InlineLinkPreviewElementTransform, opts.inlineLinkPreview.options)
      }
    },
  }
}
