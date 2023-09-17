import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  title: {
    title: 'Enhanced Readability',
    titleAriaLabel: 'Enhanced Readability',
  },
  layoutSwitch: {
    title: 'Layout Switch',
    titleAriaLabel: 'Layout Switch',
    titleScreenNavWarningMessage: 'No available layout can be switched in mobile screen.',
    optionFullWidth: 'Expand all',
    optionFullWidthAriaLabel: 'Expand all',
    optionOnlySidebarFullWidth: 'Expand only sidebar',
    optionOnlySidebarFullWidthAriaLabel: 'Expand only sidebar',
    optionFitContentWidth: 'Fit content width',
    optionFitContentWidthAriaLabel: 'Fit content width',
  },
  inlineHighlight: {
    title: 'Inline Highlight',
    titleAriaLabel: 'Inline Highlight',
    titleScreenNavWarningMessage: 'Inline highlight is not available in mobile screen temporarily.',
    optionOn: 'On',
    optionOnAriaLabel: 'On',
    optionOff: 'Off',
    optionOffAriaLabel: 'Off',
  },
}

export const defaultZhCNLocale: Locale = {
  title: {
    title: '阅读增强',
    titleAriaLabel: '阅读增强',
  },
  layoutSwitch: {
    title: '布局切换',
    titleAriaLabel: '布局切换',
    titleScreenNavWarningMessage: '移动端无可切换布局。',
    optionFullWidth: '全部展开',
    optionFullWidthAriaLabel: '全部展开',
    optionOnlySidebarFullWidth: '仅侧边栏展开',
    optionOnlySidebarFullWidthAriaLabel: '仅侧边栏展开',
    optionFitContentWidth: '自适应内容宽度',
    optionFitContentWidthAriaLabel: '自适应内容宽度',
  },
  inlineHighlight: {
    title: '行内高亮',
    titleAriaLabel: '行内高亮',
    titleScreenNavWarningMessage: '移动端暂不支持行内高亮。',
    optionOn: '开启',
    optionOnAriaLabel: '开启',
    optionOff: '关闭',
    optionOffAriaLabel: '关闭',
  },
}
