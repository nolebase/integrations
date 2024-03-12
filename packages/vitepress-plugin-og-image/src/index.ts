import { fileURLToPath } from 'node:url'
import { dirname, relative, resolve, sep } from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { Resvg } from '@resvg/resvg-js'
import type { Config } from './types/config'
import type { ArticleTree } from './types/metadata'
import { removeEmoji } from './utils'

export default async function run(config: Config) {
  const { sidebar, plainTargetDomain, dist, description } = config

  // TODO: Load public files in a better way
  const DIR_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const ogSvg = fs.readFileSync(resolve(DIR_ROOT, './public/og-template.svg'), 'utf-8')
  const fontPath = resolve(DIR_ROOT, './public/SourceHanSansSC.otf')

  // Flatten sidebar
  let articles: ArticleTree[] = []
  articles = articles.concat(...sidebar.map((series: { items: any[], text: any }) => {
    return [...series?.items.map((item) => {
      return {
        ...item,
        category: series.text,
      }
    })] || []
  }))

  async function generateSVG(article: ArticleTree, output: string) {
    // Remove emoji and split lines
    const lines = removeEmoji(article.text)
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

    const category = article.category ? removeEmoji(article.category).trim() : ''

    const data = {
      line1: lines[0] || '',
      line2: lines[1] || '',
      line3: `${lines[2] || ''}${lines[3] ? '...' : ''}`,
      category,
    }

    const svg = ogSvg.replace(/\{\{([^}]+)}}/g, (_, name) => {
      if (!name || typeof name !== 'string' || !(name in data))
        return ''

      const nameKeyOf = name as keyof typeof data
      return data[nameKeyOf]
    })

    try {
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 },
        font: {
          fontFiles: [fontPath],
          // Load system fonts might cost more time
          loadSystemFonts: false,
        },
      })
      const buffer = resvg.render().asPng()
      await fs.writeFile(output, buffer)
    }
    catch (err) {
      console.error(`Generate OG Image Failed: [${output}] ${err}`)
    }
  }

  const files = await fg(`${dist}/**/*.html`, { onlyFiles: true })

  await Promise.all(files.map(async (file) => {
    let html = await fs.readFile(file, 'utf-8')

    // TODO: Maybe have a better way to deal with Windows or other OS
    const relativePath = relative(dist, file)
    const link = `/${
      relativePath
      .slice(0, relativePath.lastIndexOf('.'))
      .replaceAll(sep, '/')
    }`.split('/index')[0]

    const article = articles.find(item => (item.link === link) || (item.link === `${link}/`))
    if (!article)
      return null

    const ogName = `${dirname(file)}/og-${article.index || article.text}.png`
    await generateSVG(article, ogName)

    const ogNameRegexp = new RegExp(`${plainTargetDomain}/og.png`, 'g')
    html = html.replace(ogNameRegexp, `${plainTargetDomain}/${relative(dist, ogName)}`.toLocaleLowerCase())
    html = html.replace(
      /<meta property="og:title" content="([^"]+)">/g,
      `<meta property="og:title" content="${article.text}">`,
    )
    html = html.replace(
      /<meta property="og:description" content="([^"]+)">/g,
      `<meta property="og:description" content="${article.category} - ${description}">`,
    )

    try {
      await fs.writeFile(file, html, 'utf-8')
    }
    catch (err) {
      console.error(`Generate OG Image Failed: ${err}`)
    }
  }))
}
