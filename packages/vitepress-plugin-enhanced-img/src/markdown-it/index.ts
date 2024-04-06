import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path/posix'
import { globSync } from 'glob'

import type { PluginSimple } from 'markdown-it'
import { normalizePath } from 'vite'
import { cyan, gray, yellow } from 'colorette'

export const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

interface ThumbHash {
  /**
   * The file name of the image. Will be normalized to be relative to the
   * root of the VitePress configuration file.
   */
  assetFileName: string
  /**
   * The full file name of the image.
   */
  assetFullFileName: string
  /**
   * The hash of the image.
   */
  assetHash: string
  /**
   * The asset URL of the image. Will be used to render as `src` attribute
   * in the HTML.
   */
  assetUrl: string
  /**
   * The asset URL of the image with base. Will be used to render as `data-src`
   * attribute in the HTML used by unlazy.
   *
   * Value will be automatically calculated based on the `base` field
   * configured in the VitePress configuration.
   */
  assetUrlWithBase: string
  /**
   * The thumbhash data URL of the image. Will be used to render as
   * `src` attribute in the HTML.
   */
  dataUrl: string
  /**
   * The thumbhash data base64 of the image. Will be used to render as
   * `data-thumbhash` attribute in the HTML.
   */
  dataBase64: string
  /**
   * The resized width of the image (thumbhash requires the image to be
   * resized to less than 100px in width or height).
   */
  width: number
  /**
   * The original width of the image.
   */
  originalWidth: number
  /**
   * The resized height of the image (thumbhash requires the image to
   * be resized to less than 100px in width or height).
   */
  height: number
  /**
   * The original height of the image.
   */
  originalHeight: number
}

export const ThumbhashImg: () => PluginSimple = () => {
  const thumbhashMapFile = globSync(
    '**/.vitepress/cache/@nolebase/vitepress-plugin-enhanced-img/thumbhashes/map.json',
    {
      ignore: 'node_modules/**',
      nodir: true,
    },
  )
  if (thumbhashMapFile.length === 0)
    throw new Error('thumbhash map file not found')
  if (!thumbhashMapFile[0])
    throw new Error('thumbhash map file not found')

  const thumbhashMap = JSON.parse(readFileSync(thumbhashMapFile[0], 'utf-8')) as Record<string, ThumbHash>

  return (md) => {
    const imageRule = md.renderer.rules.image!

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      if (!env.path && !env.relativePath)
        throw new Error('env.path and env.relativePath are required')

      const token = tokens[idx]

      const imgSrc = token.attrGet('src')
      if (!imgSrc)
        return imageRule(tokens, idx, options, env, self)
      if (EXTERNAL_URL_RE.test(imgSrc))
        return imageRule(tokens, idx, options, env, self)
      if (['.png', '.jpg', '.jpeg'].every(ext => imgSrc.endsWith(ext))) {
        console.warn(`${yellow(`[@nolebase/vitepress-plugin-enhanced-img/markdown-it] [WARN]`)} ${yellow(`unsupported image format for ${imgSrc}`)}`)
        return imageRule(tokens, idx, options, env, self)
      }

      let resolvedImgSrc = imgSrc
      if (!resolvedImgSrc.startsWith('/')) {
        const relativePathDir = normalizePath(dirname(env.relativePath))

        resolvedImgSrc = join(relativePathDir, resolvedImgSrc)
        if (resolvedImgSrc.startsWith('/'))
          resolvedImgSrc = resolvedImgSrc.slice(1)
      }
      else {
        resolvedImgSrc = resolvedImgSrc.slice(1)
      }

      const matchedThumbhashData = thumbhashMap[resolvedImgSrc]
      if (!matchedThumbhashData) {
        console.warn(`${cyan(`@nolebase/vitepress-plugin-enhanced-img/markdown-it`)}${gray(':')} ${yellow(`[WARN]`)} thumbhash data not found for ${resolvedImgSrc}}`)
        return imageRule(tokens, idx, options, env, self)
      }

      token.attrSet('src', matchedThumbhashData.dataUrl)
      token.attrSet('data-src', matchedThumbhashData.assetUrlWithBase)
      token.attrSet('data-thumbhash', matchedThumbhashData.dataBase64)
      token.attrSet('data-sizes', 'auto')
      token.attrSet('width', matchedThumbhashData.originalWidth.toString())
      token.attrSet('height', matchedThumbhashData.originalHeight.toString())
      token.attrSet('loading', 'lazy')

      tokens[idx] = token

      return imageRule(tokens, idx, options, env, self)
    }
  }
}
