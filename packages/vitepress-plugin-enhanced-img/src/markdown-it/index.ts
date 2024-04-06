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

export const ThumbhashImg: () => PluginSimple = () => {
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
      // Skip external URLs
      if (EXTERNAL_URL_RE.test(imgSrc))
        return imageRule(tokens, idx, options, env, self)
      // Skip unsupported image formats
      if (['.png', '.jpg', '.jpeg'].every(ext => imgSrc.endsWith(ext))) {
        console.warn(`${yellow(`[@nolebase/vitepress-plugin-enhanced-img/markdown-it] [WARN]`)} ${yellow(`unsupported image format for ${imgSrc}`)}`)
        return imageRule(tokens, idx, options, env, self)
      }

      let resolvedImgSrc = imgSrc
      // If there is a leading slash, means it is an absolute path from the root of the site
      if (resolvedImgSrc.startsWith('/')) {
        // Remove the leading slash for matching with the thumbhash map
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
      const matchedThumbhashData = thumbhashMap[resolvedImgSrc]
      if (!matchedThumbhashData) {
        // Usually this should not happen
        console.warn(`${cyan(`@nolebase/vitepress-plugin-enhanced-img/markdown-it`)}${gray(':')} ${yellow(`[WARN]`)} thumbhash data not found for ${resolvedImgSrc}}`)
        return imageRule(tokens, idx, options, env, self)
      }

      // Apply all the attributes as
      // https://unlazy.byjohann.dev/placeholders/thumbhash.html
      // and https://unlazy.byjohann.dev/api/lazy-load.html
      // have stated
      token.attrSet('src', matchedThumbhashData.dataUrl)
      token.attrSet('data-src', imgSrc)
      token.attrSet('data-thumbhash', matchedThumbhashData.dataBase64)
      token.attrSet('data-sizes', 'auto')
      token.attrSet('width', matchedThumbhashData.originalWidth.toString())
      token.attrSet('height', matchedThumbhashData.originalHeight.toString())
      token.attrSet('loading', 'lazy')

      return imageRule(tokens, idx, options, env, self)
    }
  }
}
