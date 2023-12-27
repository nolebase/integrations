import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  noLogs: 'No recent changes',
  viewMore: 'View more',
  lastEdited: 'This page was last edited {{daysAgo}}',
  committedOn: ' on {{date}}',
}

export const defaultZhCNLocale: Locale = {
  noLogs: '暂无最近变更历史',
  viewMore: '查看更多',
  lastEdited: '此文档最后编辑于 {{daysAgo}}',
  committedOn: '于 {{date}}',
}
