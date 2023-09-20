import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  popup: {
    loading: 'Loading',
    loadingAriaLabel: 'Loading',
    openInCurrentPage: 'Open in current page',
    openInCurrentPageAriaLabel: 'Open in current page',
    iframeAriaLabel: 'Inline link preview of link at {href}',
  },
}

export const defaultZhCNLocale: Locale = {
  popup: {
    loading: '加载中',
    loadingAriaLabel: '加载中',
    openInCurrentPage: '在当前页面打开',
    openInCurrentPageAriaLabel: '在当前页面打开',
    iframeAriaLabel: '在 {href} 的链接的行内链接预览',
  },
}
