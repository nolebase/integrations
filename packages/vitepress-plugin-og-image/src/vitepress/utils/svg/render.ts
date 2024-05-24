import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

import { removeEmoji } from '../emoji'
import { escape } from './escape'

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

export async function renderSVG(svgContent: string, fontBuffer?: Uint8Array): Promise<Uint8Array> {
  try {
    const resvg = new Resvg(
      svgContent,
      {
        fitTo: { mode: 'width', value: 1200 },
        font: {
          fontBuffers: fontBuffer ? [fontBuffer] : [],
          // Load system fonts might cost more time
          loadSystemFonts: false,
        },
      },
    )

    try {
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
