import type { PluginSimple } from 'markdown-it'
import type Token from 'markdown-it/lib/token'

/**
 * A markdown-it plugin to transform the token
 * @param options The options for the plugin
 * @param options.transformToken The function to transform the token
 * @returns The markdown-it plugin
 */
const MarkdownItTokenTransform: (options: {
  /**
   * The function to transform the token
   * @param token The token to be transformed
   * @param env The environment of the markdown-it
   */
  transformToken: (token: Token, env: any) => void
}) => PluginSimple = (options) => {
  return (md) => {
    md.core.ruler.push(
      'token_transform',
      (state) => {
        const transformFunc = options.transformToken === undefined ? function () { } : options.transformToken

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
}

/**
 * A markdown-it plugin to transform the token
 * @param options The options for the plugin
 * @param options.transformToken The function to transform the token
 * @returns The markdown-it plugin
 */
export default MarkdownItTokenTransform
