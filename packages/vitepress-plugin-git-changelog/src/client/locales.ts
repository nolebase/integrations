import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  noLogs: 'No recent changes',
  noContributors: 'No contributors',
  lastEdited: 'Last edited {{daysAgo}}',
  viewFullHistory: 'View full history',
  committedOn: ' on {{date}}',
}

export const defaultZhCNLocale: Locale = {
  noLogs: '暂无最近变更历史',
  noContributors: '暂无相关贡献者',
  lastEdited: '最后编辑于 {{daysAgo}}',
  viewFullHistory: '查看完整历史',
  committedOn: ' 于 {{date}}',
}
