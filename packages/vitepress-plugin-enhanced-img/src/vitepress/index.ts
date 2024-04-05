import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { TransformContext } from 'vitepress'

import { type Plugin, unified } from 'unified'
import RehypeParse from 'rehype-parse'
import RehypeStringify from 'rehype-stringify'
import { select, selectAll } from 'hast-util-select'
import type { Parents } from 'hast'
import type { Node } from 'unist'

interface ThumbHashData {
  fileName: string
  assetUrl: string
  assetUrlWithBase: string
  dataURL: string
  dataBase64: string
  width: number
  originalWidth: number
  height: number
  originalHeight: number
  referenceId: string
}

let cachedThumbHash: Record<string, ThumbHashData>

interface RehypeImgThumbhashOptions {
  thumbHash: Record<string, ThumbHashData>
}

const RehypeThumbHash: Plugin<[(RehypeImgThumbhashOptions | null | undefined)?]> = (options) => {
  return (tree: Node) => {
    const body = select('body', tree as unknown as Parents)
    if (!body)
      return

    const imgs = selectAll('img', body)
    if (!imgs || imgs.length === 0)
      return

    for (const img of imgs) {
      if (!img.properties.src)
        return
      if (typeof img.properties.src !== 'string')
        return

      const matchedThumbhashData = options?.thumbHash[img.properties.src]
      if (!matchedThumbhashData)
        return

      img.properties['data-src'] = matchedThumbhashData.assetUrlWithBase
      img.properties['data-thumbhash'] = matchedThumbhashData.dataBase64
      img.properties['data-sizes'] = 'auto'
      img.properties.width = matchedThumbhashData.originalWidth
      img.properties.height = matchedThumbhashData.originalHeight
      img.properties.loading = 'lazy'
    }

    return tree
  }
}

/**
 * Transform HTML for enhanced img.
 *
 * This transform hook should be used with `ThumbnailHashImages` plugin
 * exported by `@nolebase/vitepress-plugin-enhanced-img` in order to
 * correctly calculate and populate the thumbhash data for images before
 * rendering them.
 *
 * @param code - The HTML code to transform.
 * @param _id - The ID of the file.
 * @param ctx - The transform context.
 * @returns The transformed HTML code.
 */
export async function transformHTMLForEnhancedImg(code: string, _id: string, ctx: TransformContext): Promise<string> {
  const { siteConfig } = ctx

  if (!cachedThumbHash) {
    const readContent = await readFile(join(
      siteConfig.cacheDir,
      'nolebase',
      'vitepress-plugin-enhanced-img',
      'thumbhash-map.json',
    ))

    cachedThumbHash = JSON.parse(readContent.toString('utf-8'))
  }

  const result = await unified()
    .use(RehypeParse)
    .use(RehypeThumbHash, { thumbHash: cachedThumbHash })
    .use(RehypeStringify)
    .process(code)

  return String(result)
}
