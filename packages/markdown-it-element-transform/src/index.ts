import type { PluginWithOptions } from 'markdown-it'
import type StateCore from 'markdown-it/lib/rules_core/state_core'
import type Token from 'markdown-it/lib/token'

export interface Options {
  /**
   * The function to transform the token
   * @param {Token} token The token to be transformed
   * @param {StateCore} state The state of the markdown-it
   * @param {object} env The environment of the markdown-it
   */
  transform: (token: Token, state: StateCore, env: any) => void
}

/**
 * A markdown-it plugin to transform the token
 * @param md The markdown-it instance
 * @param options The options for the plugin
 * @param options.transform The function to transform the token
 */
export const ElementTransform: PluginWithOptions<Options> = (md, options) => {
  if (!options || !options.transform)
    throw new Error('The `transform` option is required')

  md.core.ruler.push(
    'token_transform',
    (state) => {
      const transformFunc = options.transform === undefined ? function () { } : options.transform

      state.tokens.forEach((token) => {
        if (token.children && token.children.length) {
          token.children.forEach((token) => {
            transformFunc(token, state, state.env)
          })
        }

        transformFunc(token, state, state.env)
      })

      return false
    },
  )
}
