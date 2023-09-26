import { relative, resolve } from 'node:path'
import type { Plugin } from 'vite'

const ROOT = resolve(__dirname, '../../')

export function MarkdownTransform(): Plugin {
  return {
    name: 'docs-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      // 将 ID 转换为相对路径，便于进行正则匹配
      id = relative(ROOT, id)
      code = `${code}\n\n<CommentAnnotation />`

      return code
    },
  }
}
