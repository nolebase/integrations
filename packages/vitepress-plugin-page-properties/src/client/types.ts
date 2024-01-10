export interface Locale {
}

export interface Options {
  /**
   * Internationalization configuration
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * @default undefined
   * @example
   * ```ts
   * {
   *  locales: {
   *    'en': {
   *      ...
   *    },
   *    'zh-CN': {
   *      ...
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
}
