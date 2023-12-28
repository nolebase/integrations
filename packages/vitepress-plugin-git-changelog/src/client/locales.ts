import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  noLogs: 'No recent changes',
  lastEdited: 'Last edited {{daysAgo}}',
  committedOn: ' on {{date}}',
}

export const defaultZhCNLocale: Locale = {
  noLogs: '暂无最近变更历史',
  lastEdited: '最后编辑于 {{daysAgo}}',
  committedOn: ' 于 {{date}}',
}
