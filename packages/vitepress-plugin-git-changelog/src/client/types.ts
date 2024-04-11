import type { Contributor } from '../types'

export interface Locale extends Record<string, any> {
  /**
   * What to display when there are no logs
   */
  noLogs?: string
  /**
   * What to display when there are no contributors
   */
  noContributors?: string
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
  mapContributors?: Contributor[]
}
