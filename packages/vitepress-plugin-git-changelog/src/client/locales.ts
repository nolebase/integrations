import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  noLogs: 'No recent changes',
  lastEdited: 'Last edited {{daysAgo}}',
  viewFullHistory: 'View full history',
  committedOn: ' on {{date}}',
}

export const defaultZhCNLocale: Locale = {
  noLogs: '暂无最近变更历史',
  lastEdited: '最后编辑于 {{daysAgo}}',
  viewFullHistory: '查看完整历史',
  committedOn: ' 于 {{date}}',
}
