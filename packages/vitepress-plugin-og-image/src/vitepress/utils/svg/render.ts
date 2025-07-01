import type { BuildEndGenerateOpenGraphImagesOptions } from '../../../vitepress/types'

import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

import { initWasm, Resvg } from '@resvg/resvg-wasm'

import { removeEmoji } from '../emoji'
import { escape } from './escape'

const imageBuffers = new Map<string, Promise<Buffer>>()

export function templateSVG(siteName: string, siteDescription: string, title: string, category: string, ogTemplate: string, maxCharactersPerLine?: number): string {
  maxCharactersPerLine ??= 17

  // Remove emoji and split lines
  const lines = removeEmoji(title)
    .trim()
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map(line => line.trim())

  // Restricted `maxCharactersPerLine` characters per line
  for (let i = 0; i < lines.length; i++) {
    const val = lines[i].trim()

    if (val.length > maxCharactersPerLine) {
      // attempt to break at a space
      let breakPoint = val.lastIndexOf(' ', maxCharactersPerLine)

      // attempt to break before before a capital letter
      if (breakPoint < 0) {
        for (let j = Math.min(val.length - 1, maxCharactersPerLine); j > 0; j--) {
          if (val[j] === val[j].toUpperCase()) {
            breakPoint = j
            break
          }
        }
      }
      if (breakPoint < 0)
        breakPoint = maxCharactersPerLine

      lines[i] = val.slice(0, breakPoint)
      lines[i + 1] = `${val.slice(lines[i].length)}${lines[i + 1] || ''}`
    }
    lines[i] = lines[i].trim()
  }

  const categoryStr = category ? removeEmoji(category).trim() : ''

  const data = {
    siteName,
    siteDescription,
    category: categoryStr,
    line1: lines[0] || '',
    line2: lines[1] || '',
    line3: `${lines[2] || ''}${lines[3] ? '...' : ''}`,
  }

  return ogTemplate.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    if (!name || typeof name !== 'string' || !(name in data))
      return ''

    const nameKeyOf = name as keyof typeof data
    return escape(data[nameKeyOf])
  })
}

let resvgInit = false

export async function initSVGRenderer() {
  try {
    if (!resvgInit) {
      const wasm = readFile(createRequire(import.meta.url).resolve('@resvg/resvg-wasm/index_bg.wasm'))
      await initWasm(wasm)
      resvgInit = true
    }
  }
  catch (err) {
    throw new Error(`Failed to init resvg wasm due to ${err}`)
  }
}

let fontBuffer: Uint8Array

export async function initFontBuffer(options?: { fontPath?: string }): Promise<Uint8Array | undefined> {
  if (!options?.fontPath)
    return
  if (fontBuffer)
    return fontBuffer

  try {
    fontBuffer = await readFile(options.fontPath)
  }
  catch (err) {
    throw new Error(`Failed to read font file due to ${err}`)
  }

  return fontBuffer
}

export async function renderSVG(
  svgContent: string,
  fontBuffer?: Uint8Array,
  imageUrlResolver?: BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver'],
  additionalFontBuffers?: Uint8Array[],
  resultImageWidth?: number,
): Promise<{
  png: Uint8Array
  width: number
  height: number
}> {
  try {
    const resvg = new Resvg(
      svgContent,
      {
        fitTo: { mode: 'width', value: resultImageWidth ?? 1200 },
        font: {
          fontBuffers: fontBuffer
            ? [fontBuffer, ...(additionalFontBuffers ?? [])]
            : (additionalFontBuffers ?? []),
          // Load system fonts might cost more time
          loadSystemFonts: false,
        },
      },
    )

    try {
      const resolvedImages = await Promise.all(
        resvg.imagesToResolve().map(async (url) => {
          return {
            url,
            buffer: await resolveImageUrlWithCache(url, imageUrlResolver),
          }
        }),
      )

      for (const { url, buffer } of resolvedImages)
        resvg.resolveImage(url, buffer)

      const res = resvg.render()

      return {
        png: res.asPng(),
        width: res.width,
        height: res.height,
      }
    }
    catch (err) {
      throw new Error(`Failed to render open graph images on path due to ${err}`)
    }
  }
  catch (err) {
    throw new Error(`Failed to initiate Resvg instance to render open graph images due to ${err}`)
  }
}

function resolveImageUrlWithCache(url: string, imageUrlResolver?: BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver']): Promise<Buffer> {
  if (imageBuffers.has(url))
    return imageBuffers.get(url)!

  const result = resolveImageUrl(url, imageUrlResolver)
  imageBuffers.set(url, result)

  return result
}

async function resolveImageUrl(url: string, imageUrlResolver?: BuildEndGenerateOpenGraphImagesOptions['svgImageUrlResolver']) {
  if (imageUrlResolver != null) {
    const res = await imageUrlResolver(url)
    if (res != null)
      return res
  }

  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  return Buffer.from(buffer)
}
