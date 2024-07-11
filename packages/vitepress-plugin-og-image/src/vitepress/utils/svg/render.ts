import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { Buffer } from 'node:buffer'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

import { removeEmoji } from '../emoji'
import type { BuildEndGenerateOpenGraphImagesOptions } from '../../index'
import { escape } from './escape'

const imageBuffers = new Map<string, Promise<Buffer>>()

export function templateSVG(siteName: string, siteDescription: string, title: string, category: string, ogTemplate: string): string {
  // Remove emoji and split lines
  const lines = removeEmoji(title)
    .trim()
    .replace(/(?![^\n]{1,17}$)([^\n]{1,17})\s/g, '$1\n')
    .split('\n')

  // Restricted 17 words per line
  lines.forEach((val, i) => {
    if (val.length > 17) {
      lines[i] = val.slice(0, 17)
      lines[i + 1] = `${val.slice(17)}${lines[i + 1] || ''}`
    }
    lines[i] = lines[i].trim()
  })

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
): Promise<Uint8Array> {
  try {
    const resvg = new Resvg(
      svgContent,
      {
        fitTo: { mode: 'width', value: 1200 },
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

      return resvg.render().asPng()
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
