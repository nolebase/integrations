import { basename, extname, join, relative } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

import {
  type Plugin,
  normalizePath,
} from 'vite'
import type { SiteConfig } from 'vitepress'

import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { subtle } from 'uncrypto'

interface VitePressConfig {
  vitepress: SiteConfig
}

interface ThumbHash {
  /**
   * The file name of the image. Will be normalized to be relative to the
   * root of the VitePress configuration file.
   */
  fileName: string
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
  dataURL: string
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

// thumbhash/examples/browser/index.html at main · evanw/thumbhash
// https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
const binaryToBase64 = (binary: Uint8Array) => btoa(String.fromCharCode(...binary))

async function calculateThumbHashForFile(imageData: Uint8Array): Promise<{
  base64: string
  dataUrl: string
  width: number
  originalWidth: number
  height: number
  originalHeight: number
}> {
  // vite-plugin-thumbhash/packages/core/index.ts at main · cijiugechu/vite-plugin-thumbhash
  // https://github.com/cijiugechu/vite-plugin-thumbhash/blob/main/packages/core/index.ts

  const image = await loadImage(imageData)
  const width = image.width
  const height = image.height

  const scale = 100 / Math.max(width, height)
  const resizedWidth = Math.round(width * scale)
  const resizedHeight = Math.round(height * scale)

  // Paint the image to the canvas.
  const canvas = createCanvas(resizedWidth, resizedHeight)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  // Retrieve back the image data for thumbhash calculation as the
  // form of RGBA matrix.
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)

  // Easy calculation of thumbhash data.
  const thumbHashBinary = rgbaToThumbHash(pixels.width, pixels.height, pixels.data)
  // Encode the thumbhash data to base64 and data URL.
  const thumbHashBase64 = binaryToBase64(thumbHashBinary)
  const thumbHashDataURL = await thumbHashToDataURL(thumbHashBinary)

  return {
    base64: thumbHashBase64,
    dataUrl: thumbHashDataURL,
    width: resizedWidth,
    height: resizedHeight,
    originalWidth: width,
    originalHeight: height,
  }
}

/**
 * Hashes the given data using SHA-256 algorithm.
 *
 * Official example by MDN: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * @param {Uint8Array} data - The data to be hashed
 * @returns {Promise<string>} - The SHA-256 hash of the message
 */
async function digestUint8ArrayDataSha256(data: Uint8Array) {
  const hashBuffer = await subtle.digest('SHA-256', data) // hash the message
  return Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
}

/**
 * Simulate hash function of rollup.
 *
 * About hashing, please read the documentation of rollup:
 * https://rollupjs.org/configuration-options/#output-hashcharacters
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/docs/configuration-options/index.md?plain=1#L628
 *
 * For implementation details, please read the source code of rollup:
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/src/utils/FileEmitter.ts#L259
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/src/utils/crypto.ts#L12
 * @param {Uint8Array} data - The data to be hashed
 * @returns {Promise<string>} - The first 10 characters of the SHA-256 hash of the message
 */
async function hash(data: Uint8Array) {
  const hashResult = await digestUint8ArrayDataSha256(data)
  const hashBase64 = binaryToBase64(new Uint8Array(hashResult)) // convert bytes to base64 encoded string

  return hashBase64.substring(0, 10)
}

function normalizeBase64(base64: string) {
  return base64.replace('/', '_').replace('+', '-').replace('=', '-')
}

/**
 * The Vite plugin to pre-process images and generate thumbhash data for them.
 *
 * @returns {Plugin} - The Vite plugin instance
 */
export function ThumbnailHashImages(): Plugin {
  const thumbhashMap: Record<string, ThumbHash> = {}
  const emittedFileNames = new Set<string>()
  let root = ''
  let vitepressConfig: SiteConfig

  return {
    name: '@nolebase/vitepress-plugin-enhanced-img/thumbnail-hash-images',
    config() {
      return {
        optimizeDeps: {
          exclude: [
            '@nolebase/vitepress-plugin-enhanced-img/client',
          ],
        },
        ssr: {
          noExternal: [
            '@nolebase/vitepress-plugin-enhanced-img',
          ],
        },
      }
    },
    configResolved(config) {
      root = config.root
      vitepressConfig = (config as unknown as VitePressConfig).vitepress
    },
    // The reason why the first parameter `code` is omitted as `_` is because
    // the code itself will never be the original raw data of the image,
    // instead, it will be __VITE_ASSET__<id>__, and this is useless for calculating
    // and hashing.
    async transform(_, id) {
      // TODO: Add support for more image formats.
      if (!(id.endsWith('.jpg') || id.endsWith('.jpeg') || id.endsWith('.png')))
        return

      const readImageRawData = await readFile(id)

      // The hash implementation is mirrored and simulated from the rollup.
      // But it's never guaranteed to be the same as the rollup's hash.
      const fileHashBase64 = normalizeBase64(await hash(readImageRawData))

      // Concat file names as the default of rollup: [name].[hash].[ext]
      const fileName = `${basename(id).replace(extname(id), '')}.${fileHashBase64}${extname(id)}`

      // Calculate the thumbhash data for the image as thumbhash demonstrates.
      const calculatedData = await calculateThumbHashForFile(readImageRawData)

      if (!emittedFileNames.has(fileName)) {
        // Thanks for the implementation of `vite-plugin-image-presets` as a reference:
      // ElMassimo/vite-plugin-image-presets: 🖼 Image Presets for Vite.js apps
      // https://github.com/ElMassimo/vite-plugin-image-presets
        this.emitFile({
          type: 'asset',
          // Use file name here since we need to ensure the file name is possible to be obtained
          // and stored to the assets directory, thumbhash map.
          //
          // REVIEW: What about the other plugins that wanted to manipulate the images?
          fileName: join(vitepressConfig.assetsDir, fileName),
          source: readImageRawData,
        })
      }

      // Cache the emitted file names for later use.
      emittedFileNames.add(fileName)

      const thumbhashData = {
        fileName: id,
        assetUrl: normalizePath(join(vitepressConfig.assetsDir, fileName)),
        assetUrlWithBase: normalizePath(join(vitepressConfig.site.base, vitepressConfig.assetsDir, fileName)),
        dataURL: calculatedData.dataUrl,
        dataBase64: calculatedData.base64,
        width: calculatedData.width,
        originalWidth: calculatedData.originalWidth,
        height: calculatedData.height,
        originalHeight: calculatedData.originalHeight,
      }

      // Since assets url is used to refer to the image when rendered
      // in the HTML, we need to ensure that the asset URL starts with a slash
      // where base is not included.
      if (!thumbhashData.assetUrlWithBase.startsWith('/'))
        thumbhashData.assetUrlWithBase = `/${thumbhashData.assetUrlWithBase}`

      thumbhashData.fileName = normalizePath(relative(root, id))
      // Cache the thumbhash data for later use.
      thumbhashMap[thumbhashData.dataURL] = thumbhashData

      // Thanks for the implementation of `vite-plugin-image-presets` as a reference:
      // ElMassimo/vite-plugin-image-presets: 🖼 Image Presets for Vite.js apps
      // https://github.com/ElMassimo/vite-plugin-image-presets
      //
      // as well as the great answer from Stack Overflow:
      // Generate thumbnail images in sveltekit/vite on build - Stack Overflow
      // https://stackoverflow.com/questions/75789944/generate-thumbnail-images-in-sveltekit-vite-on-build
      //
      // as well as the great article from DEV community:
      // Automated Image Compression: A Vite Plugin Using Sharp - DEV Community
      // https://dev.to/mrwaip/automated-image-compression-a-vite-plugin-using-sharp-3h5d
      return `export default ${JSON.stringify(thumbhashData.dataURL)}`
    },
    async buildEnd() {
      await mkdir(
        join(vitepressConfig.cacheDir, 'nolebase', 'vitepress-plugin-enhanced-img'),
        { recursive: true },
      )

      await writeFile(
        join(vitepressConfig.cacheDir, 'nolebase', 'vitepress-plugin-enhanced-img', 'thumbhash-map.json'),
        JSON.stringify(thumbhashMap, null, 2),
      )
    },
  }
}
