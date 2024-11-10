export interface Locale extends Record<string, any> {
  recentUpdates?: {
    category?: string
    updatedAt?: string
  }
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
   *       recentUpdates: {
   *         category: 'Category: ',
   *         updatedAt: 'Updated at: ',
   *       }
   *    },
   *    'zh-CN': {
   *       recentUpdates: {
   *         category: '类别：',
   *         updatedAt: '更新于：',
   *       }
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
}
