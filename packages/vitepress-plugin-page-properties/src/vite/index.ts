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
  excludes?: string[]
  exclude?: (id: string, context: Context) => boolean
}): Plugin {
  const {
    excludes = ['index.md'],
    exclude = () => false,
  } = options ?? {}

  let root = ''

  return {
    name: '@nolebase/vitepress-plugin-page-properties-markdown-section',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
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

      const context: Context = {
        helpers: {
          pathEndsWith,
          pathEquals,
          pathStartsWith,
          idEndsWith,
          idEquals,
          idStartsWith,
        },
      }

      if (!id.endsWith('.md'))
        return null
      if (excludes.includes(id))
        return null
      if (exclude(id, context))
        return null

      const targetComponent = env.NODE_ENV === 'development'
        ? TemplatePagePropertiesEditor()
        : TemplatePageProperties()

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

function TemplatePagePropertiesEditor(): string {
  return `

<NolebasePagePropertiesEditor />
`
}

function TemplatePageProperties(): string {
  return `

<NolebasePageProperties />

`
}
