import type { PluginWithOptions } from 'markdown-it'

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path/posix'

import { cyan, gray, yellow } from 'colorette'
import { globSync } from 'tinyglobby'
import { normalizePath } from 'vite'

const defaultMapGlobPatterns = [
  '**/.vitepress/cache/@nolebase/vitepress-plugin-thumbnail-hash/thumbhashes/map.json',
  '.vitepress/cache/@nolebase/vitepress-plugin-thumbnail-hash/thumbhashes/map.json',
  '**/thumbhashes/map.json',
  'thumbhashes/map.json',
]

export interface ThumbHashAsset {
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
  assetFullHash: string
  /**
   * The base64 encoded url safe hash of the image.
   */
  assetFileHash: string
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
}

export interface ThumbHashCalculated {
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

export type ThumbHash = ThumbHashAsset & ThumbHashCalculated

interface ThumbnailImageThumbhashOptionsGlobPattern {
  /**
   * The glob pattern to search for the thumbhash map file.
   *
   * @default Array ['**\/.vitepress/cache/@nolebase/vitepress-plugin-thumbnail-hash/thumbhashes/map.json', '**\/thumbhashes/map.json']
   */
  mapGlobPatterns: string | string[]
}

interface ThumbnailImageThumbhashOptionsPath {
  /**
   * The path to the thumbhash map file.
   *
   * @default ''
   */
  mapFilePath: string
}

interface ThumbnailImageThumbhashOptionsMap {
  /**
   * The thumbhash map object.
   *
   * @default {}
   */
  map: Record<string, ThumbHash>
}

type ThumbnailImageThumbhashOptions = ThumbnailImageThumbhashOptionsGlobPattern | ThumbnailImageThumbhashOptionsPath | ThumbnailImageThumbhashOptionsMap

export interface UnlazyImagesOptions {
  /**
   * The tag name of the image element.
   *
   * @default string 'NolebaseEnhancedImg'
   */
  imgElementTag?: string
  /**
   * The thumbhash options.
   *
   * @default { mapGlobPatterns: ['**\/.vitepress/cache/@nolebase/vitepress-plugin-thumbnail-hash/thumbhashes/map.json', '**\/thumbhashes/map.json'] }
   */
  thumbhash?: ThumbnailImageThumbhashOptions
  /**
   * Log format not supported warning
   */
  logFormatNotSupportedWarning?: boolean
}

const logModulePrefix = `${cyan(`@nolebase/markdown-it-unlazy-img`)}${gray(':')}`

/**
 * The same regexp as VitePress uses
 * https://github.com/vuejs/vitepress/blob/3113dad002e60312ca7b679cf38b887196c33303/src/shared/shared.ts#L17
 *
 * Used in https://github.com/vuejs/vitepress/blob/3113dad002e60312ca7b679cf38b887196c33303/src/node/markdown/plugins/image.ts#L19
 */
export const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

function ensureThumbhashMap(
  options: ThumbnailImageThumbhashOptions,
  cachedMap: Record<string, ThumbHash> | undefined,
): Record<string, ThumbHash> {
  if (cachedMap)
    return cachedMap

  if ('map' in options)
    return options.map

  if ('mapFilePath' in options)
    return JSON.parse(readFileSync(options.mapFilePath, 'utf-8'))

  if (!('mapGlobPatterns' in options))
    throw new Error('either thumbhash.map, thumbhash.mapFilePath, or thumbhash.mapGlobPatterns is required')

  let mapGlobPatterns: string[] = []

  if (Array.isArray(options.mapGlobPatterns))
    mapGlobPatterns = options.mapGlobPatterns
  else
    mapGlobPatterns = [options.mapGlobPatterns]

  mapGlobPatterns = mapGlobPatterns.filter(pattern => typeof pattern === 'string' && pattern.trim() !== '')
  if (mapGlobPatterns.length === 0)
    mapGlobPatterns = defaultMapGlobPatterns

  let foundThumbhashMapPath = ''

  for (const pattern of mapGlobPatterns) {
    const matchedFiles = globSync(
      pattern,
      {
        ignore: 'node_modules/**',
        onlyFiles: true,
      },
    )
    if (matchedFiles.length === 0)
      continue
    if (!matchedFiles[0])
      continue

    foundThumbhashMapPath = matchedFiles[0]
  }
  if (!foundThumbhashMapPath) {
    throw new Error(`No thumbhash map file found in the glob patterns: ${mapGlobPatterns.join(', ')}`)
  }

  return JSON.parse(readFileSync(foundThumbhashMapPath, 'utf-8'))
}

export const UnlazyImages: () => PluginWithOptions<UnlazyImagesOptions> = () => {
  return (md, options) => {
    const {
      thumbhash = {
        mapGlobPatterns: defaultMapGlobPatterns,
      },
      imgElementTag = 'UnLazyImage',
    } = options ?? {}
    if (!thumbhash)
      throw new Error('thumbhash is required')

    let thumbhashMap: Record<string, ThumbHash> | undefined
    if ('map' in thumbhash)
      thumbhashMap = thumbhash.map

    const imageRule = md.renderer.rules.image!

    md.renderer.rules.image = (tokens, idx, mdOptions, env, self) => {
      thumbhashMap = ensureThumbhashMap(thumbhash, thumbhashMap)

      if (!env.path && !env.relativePath)
        throw new Error('env.path and env.relativePath are required')

      const token = tokens[idx]

      const imgSrc = token.attrGet('src')
      if (!imgSrc)
        return imageRule(tokens, idx, mdOptions, env, self)
      // Skip external URLs
      if (EXTERNAL_URL_RE.test(imgSrc))
        return imageRule(tokens, idx, mdOptions, env, self)
      // Skip unsupported image formats
      if (!(['.png', '.jpg', '.jpeg'].some(ext => imgSrc.endsWith(ext)))) {
        if (options?.logFormatNotSupportedWarning) {
          console.warn(`${logModulePrefix} ${yellow('[WARN]')} unsupported image format for ${imgSrc}`)
        }

        return imageRule(tokens, idx, mdOptions, env, self)
      }

      let resolvedImgSrc = decodeURIComponent(imgSrc)

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
        console.warn(`${logModulePrefix} ${yellow(`[WARN]`)} thumbhash data not found for ${resolvedImgSrc}`)
        return imageRule(tokens, idx, mdOptions, env, self)
      }

      // Apply all the attributes as
      // https://unlazy.byjohann.dev/placeholders/thumbhash.html
      // and https://unlazy.byjohann.dev/api/lazy-load.html
      // have stated
      props.thumbhash = matchedThumbhashData.dataBase64
      props.placeholderSrc = matchedThumbhashData.dataUrl
      props.autoSizes = (props.width || props.height) ? 'false' : 'true'
      props.width = props.width ?? matchedThumbhashData.originalWidth.toString()
      props.height = props.height ?? matchedThumbhashData.originalHeight.toString()

      return `<${imgElementTag} ${Object.entries(props).map(([name, value]) => `${name}="${value}"`).join(' ')} />`
    }
  }
}
