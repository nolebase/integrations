import type { PluginWithOptions } from 'markdown-it'
import type Token from 'markdown-it/lib/token'

export interface Options {
  /**
   * The function to transform the token
   * @param token The token to be transformed
   * @param env The environment of the markdown-it
   */
  transform: (token: Token, env: any) => void
}

/**
 * A markdown-it plugin to transform the token
 * @param options The options for the plugin
 * @param options.transform The function to transform the token
 * @returns The markdown-it plugin
 */
export const ElementTransform: PluginWithOptions = (md, options: Options) => {
  md.core.ruler.push(
    'token_transform',
    (state) => {
      const transformFunc = options.transform === undefined ? function () { } : options.transform

      state.tokens.forEach((token) => {
        if (token.children && token.children.length) {
          token.children.forEach((token) => {
            transformFunc(token, state.env)
          })
        }
        transformFunc(token, state.env)
      })

      return false
    },
  )
}
