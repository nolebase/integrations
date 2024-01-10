import { env } from 'node:process'
import { relative } from 'node:path'
import type { Plugin } from 'vite'
import GrayMatter from 'gray-matter'
import { pathEndsWith, pathEquals, pathStartsWith } from './path'

export interface Context {
  helpers: {
    pathEquals: (path: string, equalsWith: string) => boolean
    pathStartsWith: (path: string, startsWith: string) => boolean
    pathEndsWith: (path: string, endsWith: string) => boolean
    idEquals: (equalsWith: string) => boolean
    idStartsWith: (startsWith: string) => boolean
    idEndsWith: (endsWith: string) => boolean
  }
}

export function PagePropertiesMarkdownSection(options?: {
  getPagePropertiesTitle?: (code: string, id: string, context: Context) => string
  excludes?: string[]
  exclude?: (id: string, context: Context) => boolean
}): Plugin {
  const {
    getPagePropertiesTitle = () => {
      return 'Page Properties'
    },
    excludes = ['index.md'],
    exclude = () => false,
  } = options ?? {}

  let root = ''

  return {
    name: '@nolebase/vitepress-plugin-page-properties-markdown-section',
    configResolved(config) {
      root = config.root ?? ''
    },
    transform(code, id) {
      function idEndsWith(endsWith) {
        return pathEndsWith(relative(root, id), endsWith)
      }

      function idEquals(equals) {
        return pathEquals(relative(root, id), equals)
      }

      function idStartsWith(startsWith) {
        return pathStartsWith(relative(root, id), startsWith)
      }

      if (!id.endsWith('.md'))
        return null
      if (excludes.includes(id))
        return null
      if (exclude(id, { helpers: { pathEndsWith, pathEquals, pathStartsWith, idEndsWith, idEquals, idStartsWith } }))
        return null

      const targetComponent = env.NODE_ENV === 'development'
        ? `<div class="mt-4" />\n\n\n##### ${getPagePropertiesTitle(code, id, { helpers: { pathEndsWith, pathEquals, pathStartsWith, idEndsWith, idEquals, idStartsWith } })}\n\n<NolebasePagePropertiesEditor />\n\n\n<div class="mb-4" />`
        : `<div class="mt-4" />\n\n\n##### ${getPagePropertiesTitle(code, id, { helpers: { pathEndsWith, pathEquals, pathStartsWith, idEndsWith, idEquals, idStartsWith } })}\n\n<NolebasePageProperties />\n\n\n<div class="mb-4" />`

      const parsedMarkdownContent = GrayMatter(code)
      const hasFrontmatter = Object.keys(parsedMarkdownContent.data).length > 0

      // match any heading and move heading to top, then insert component after heading
      const headingMatch = parsedMarkdownContent.content.match(/^#{1} .*/m)
      if (!headingMatch || !headingMatch[0] || headingMatch.index === undefined) {
        if (!hasFrontmatter)
          return `${targetComponent}\n\n${code}`

        return `${GrayMatter.stringify(`${targetComponent}\n\n${parsedMarkdownContent.content}`, parsedMarkdownContent.data)}`
      }

      const headingPart = parsedMarkdownContent.content.slice(0, headingMatch.index + headingMatch[0].length)
      const contentPart = parsedMarkdownContent.content.slice(headingMatch.index + headingMatch[0].length)

      if (!hasFrontmatter)
        return `${headingPart}\n${targetComponent}\n\n${contentPart}`

      return `${GrayMatter.stringify(`${headingPart}\n${targetComponent}\n\n${contentPart}`, parsedMarkdownContent.data)}`
    },
  }
}
