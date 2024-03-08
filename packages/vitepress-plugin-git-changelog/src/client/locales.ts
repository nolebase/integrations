import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  noLogs: 'No recent changes',
  noContributors: 'No contributors',
  lastEdited: 'Last edited {{daysAgo}}',
  lastEditedDateFnsLocaleName: 'enUS',
  viewFullHistory: 'View full history',
  committedOn: ' on {{date}}',
}

export const defaultZhCNLocale: Locale = {
  noLogs: '暂无最近变更历史',
  noContributors: '暂无相关贡献者',
  lastEdited: '最后编辑于 {{daysAgo}}',
  lastEditedDateFnsLocaleName: 'zhCN',
  viewFullHistory: '查看完整历史',
  committedOn: ' 于 {{date}}',
}

export const defaultLocales: Record<string, Locale> = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
}
