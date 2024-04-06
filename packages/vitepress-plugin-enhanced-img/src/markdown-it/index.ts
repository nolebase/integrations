import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path/posix'
import { globSync } from 'glob'

import type { PluginSimple } from 'markdown-it'
import { normalizePath } from 'vite'
import { cyan, gray, yellow } from 'colorette'

import type { ThumbHash } from '../types'

/**
 * The same regexp as VitePress uses
 * https://github.com/vuejs/vitepress/blob/3113dad002e60312ca7b679cf38b887196c33303/src/shared/shared.ts#L17
 *
 * Used in https://github.com/vuejs/vitepress/blob/3113dad002e60312ca7b679cf38b887196c33303/src/node/markdown/plugins/image.ts#L19
 */
export const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

function ensureThumbhashMap(thumbhashMap?: Record<string, ThumbHash>): Record<string, ThumbHash> {
  if (thumbhashMap)
    return thumbhashMap

  // TODO: support to specify the path of the thumbhash map file
  // or specify the searching directory, or the root directory
  // from the options
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

  // TODO: support to specify the raw content of the thumbhash map from the options
  return JSON.parse(readFileSync(thumbhashMapFile[0], 'utf-8'))
}

export const ThumbhashImg: () => PluginSimple = () => {
  let thumbhashMap: Record<string, ThumbHash> | undefined

  return (md) => {
    const imageRule = md.renderer.rules.image!

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      thumbhashMap = ensureThumbhashMap()

      if (!env.path && !env.relativePath)
        throw new Error('env.path and env.relativePath are required')

      const token = tokens[idx]

      const imgSrc = token.attrGet('src')
      if (!imgSrc)
        return imageRule(tokens, idx, options, env, self)
      // Skip external URLs
      if (EXTERNAL_URL_RE.test(imgSrc))
        return imageRule(tokens, idx, options, env, self)
      // Skip unsupported image formats
      if (['.png', '.jpg', '.jpeg'].every(ext => imgSrc.endsWith(ext))) {
        console.warn(`${yellow(`[@nolebase/vitepress-plugin-enhanced-img/markdown-it] [WARN]`)} ${yellow(`unsupported image format for ${imgSrc}`)}`)
        return imageRule(tokens, idx, options, env, self)
      }

      let resolvedImgSrc = imgSrc

      const props: {
        [name: string]: string | undefined
        src: string
        alt: string
        thumbhash?: string
        placeholderSrc?: string
        width?: string
        height?: string
        autoSizes?: string
      } = {
        src: imgSrc,
        alt: token.attrGet('alt') || '',
        thumbhash: undefined,
      }

      token.attrs?.forEach(([name, value]) => {
        if (name === 'src' || name === 'alt')
          return

        props[name] = value
      })

      // This section is basically the same as https://github.com/vuejs/vitepress/blob/3113dad002e60312ca7b679cf38b887196c33303/src/shared/shared.ts#L17
      if (!/^\.?\//.test(resolvedImgSrc)) {
        // Remove the leading slash for matching with the thumbhash map
        props.src = `./${decodeURIComponent(resolvedImgSrc)}`
      }

      // If there is a leading slash, means it is an absolute path from the root of the site
      if (resolvedImgSrc.startsWith('/')) {
        resolvedImgSrc = resolvedImgSrc.slice(1)
      }
      // Otherwise, it is a relative path from the current file
      else {
        // Get the directory of the current file first
        const relativePathDir = normalizePath(dirname(env.relativePath))
        // Resolve the relative path
        resolvedImgSrc = join(relativePathDir, resolvedImgSrc)
        // Remove the leading slash if any
        if (resolvedImgSrc.startsWith('/'))
          resolvedImgSrc = resolvedImgSrc.slice(1)
      }

      // Check if the resolved image source is in the thumbhash map
      const matchedThumbhashData = thumbhashMap?.[resolvedImgSrc]
      if (!matchedThumbhashData) {
        // Usually this should not happen
        console.warn(`${cyan(`@nolebase/vitepress-plugin-enhanced-img/markdown-it`)}${gray(':')} ${yellow(`[WARN]`)} thumbhash data not found for ${resolvedImgSrc}}`)
        return imageRule(tokens, idx, options, env, self)
      }

      // Apply all the attributes as
      // https://unlazy.byjohann.dev/placeholders/thumbhash.html
      // and https://unlazy.byjohann.dev/api/lazy-load.html
      // have stated
      props.thumbhash = matchedThumbhashData.dataBase64
      props.placeholderSrc = matchedThumbhashData.dataUrl
      props.width = matchedThumbhashData.originalWidth.toString()
      props.height = matchedThumbhashData.originalHeight.toString()
      props.autoSizes = 'true'

      return `<NolebaseEnhancedImg ${Object.entries(props).map(([name, value]) => `${name}="${value}"`).join(' ')} />`
    }
  }
}
