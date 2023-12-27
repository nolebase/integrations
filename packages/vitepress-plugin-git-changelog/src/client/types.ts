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
   *      noLogs: {
   *       title: 'No recent changes',
   *    },
   *    'zh-CN': {
   *       noLogs: {
   *         title: '暂无最近变更历史',
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
}
