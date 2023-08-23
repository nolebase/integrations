import type { Plugin, ResolvedConfig } from 'vite'
import { relative, resolve } from 'path'
import MarkdownIt from 'markdown-it/index'
import express from 'express'
import bodyParser from 'body-parser'
import { handleGetTagsGeneration, handlePostTagsGeneration } from './api/server/tags/generation'
import { handlePutTags } from './api/server/tags'
import { initOpenAI } from './lib/openai'
import type { Metadata, TagAlias } from '@nolebase/shared/types'
import { listPages, processDocumentations } from '@nolebase/shared/docs'
import 'uno.css'

export function EasyTag(options: {
  target: string
  dir?: string
  openAIAPISecret: string;
  openAIAPIHost?: string;
  includes: string[],
  tagsAlias?: TagAlias[]
}): Plugin {
  let config: ResolvedConfig
  let dir: string
  let targetDir = options.target

  const handlerDependencies = {
    metadata: {} as Metadata,
  }

  return {
    name: '@nolebase/vite-plugin-vitepress-easytag',
    enforce: 'pre',
    async configResolved(c) {
      config = c

      dir = config.root
      if (options.dir) {
        dir = resolve(config.root, options.dir)
      }

      targetDir = resolve(config.root, options.target)

      const pages = await listPages(dir, { target: targetDir })
      const { docs } = await processDocumentations(pages, handlerDependencies.metadata.docs)
      handlerDependencies.metadata.docs = docs
    },
    configureServer: (server) => {
      initOpenAI({
        openAIAPISecret: options.openAIAPISecret,
        openAIAPIHost: options.openAIAPIHost
      })

      const app = express()

      app.get('/api/v1/tags/generation', handleGetTagsGeneration(handlerDependencies))
      app.post('/api/v1/tags/generation', bodyParser.json(), handlePostTagsGeneration(handlerDependencies))
      app.put('/api/v1/tags', bodyParser.json(), handlePutTags)

      server.middlewares.use(app)
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      // 将 ID 转换为相对路径，便于进行正则匹配
      id = relative(resolve(config.root), id)

      // markdown files that under include
      if (!id.match(RegExp(`^(${options.includes.join('|')})\\/`))) return

      const targetComponent = process.env.NODE_ENV === 'development' ? '<NolebaseEasyTagTagEditor />' : '<NolebaseEasyTagTags />'
      // const targetComponent = 'Tags'

      const mkit = new MarkdownIt()
      const tokens = mkit.parse(code, {})

      // search for the first heading open and close token with level 1
      const openIndex = tokens.findIndex((token) => token.type === 'heading_open' && token.markup === '#')
      const closeIndex = tokens.findIndex((token) => token.type === 'heading_close' && token.markup === '#')

      // if not found, return the original code
      if (openIndex === -1 || closeIndex === -1) return `${targetComponent}\n\n${code}`

      // concat the heading open and close token with level 1 along with the inner content of the heading
      const heading = tokens.slice(openIndex, closeIndex + 1).map((token) => {
        if (token.type === 'heading_open') return '# '
        if (token.type === 'heading_close') return ''
        return token.content
      }).join('')

      // find the exact first index of heading in raw content `code`
      const headingIndex = code.indexOf(heading)

      // if not found, return the original code
      if (headingIndex === -1) return `${targetComponent}\n\n${code}`

      // insert the <Tags /> component after the heading
      code = code.slice(0, headingIndex + heading.length) + `\n\n${targetComponent}\n\n` + code.slice(headingIndex + heading.length)
      return code
    },
  }
}
