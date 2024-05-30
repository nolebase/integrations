import type { Author, Contributor } from '../types'

export interface Locale extends Record<string, any> {
  /**
   * What to display when there are no logs
   *
   * @deprecated Use `changelog.noData` instead
   */
  noLogs?: string
  /**
   * What to display when there are no contributors
   *
   * @deprecated Use `contributors.noData` instead
   */
  noContributors?: string
  /**
   * What to display when the page was last edited
   *
   * @deprecated Use `changelog.lastEdited` instead
   */
  lastEdited?: string
  /**
   * The name of the locale to use for date-fns
   *
   * @deprecated Use `changelog.lastEditedDateFnsLocaleName` instead
   */
  lastEditedDateFnsLocaleName?: string
  /**
   * What to display when the user wants to view the full history
   *
   * @deprecated Use `changelog.viewFullHistory` instead
   */
  viewFullHistory?: string
  /**
   * What to display when the commit was committed
   *
   * @deprecated Use `changelog.committedOn` instead
   */
  committedOn?: string
  /**
   * The changelog section configuration
   */
  changelog?: {
    /**
     * The title of the changelog section
     */
    title?: string
    /**
     * What to display when there are no logs
     */
    noData?: string
    /**
     * What to display when the page was last edited
     */
    lastEdited?: string
    /**
     * The name of the locale to use for date-fns
     */
    lastEditedDateFnsLocaleName?: string
    /**
     * What to display when the user wants to view the full history
     */
    viewFullHistory?: string
    /**
     * What to display when the commit was committed
     */
    committedOn?: string
  }
  /**
   * The contributors section configuration
   */
  contributors?: {
    /**
     * The title of the contributors section
     */
    title?: string
    /**
     * What to display when there are no contributors
     */
    noData?: string
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
   *      noLogs: 'No recent changes',
   *      lastEdited: 'This page was last edited {{daysAgo}}',
   *      lastEditedDateFnsLocaleName: 'enUS',
   *      viewFullHistory: 'View full history',
   *      committedOn: ' on {{date}}',
   *    },
   *    'zh-CN': {
   *      noLogs: '暂无最近变更历史',
   *      lastEdited: '本页面最后编辑于 {{daysAgo}}',
   *      lastEditedDateFnsLocaleName: 'zhCN',
   *      viewFullHistory: '查看完整历史',
   *      committedOn: '于 {{date}} 提交',
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  /**
   * @deprecated Use `mapAuthors` instead
   * @see mapAuthors
   */
  mapContributors?: Contributor[]
  mapAuthors?: Author[]
  /**
   * Number of commit hash letters to display
   *
   * @default 7
   */
  numCommitHashLetters?: number
}
