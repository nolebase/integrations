import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  title: {
    title: 'Enhanced Readability',
    titleAriaLabel: 'Enhanced Readability',
  },
  layoutSwitch: {
    title: 'Layout Switch',
    titleHelpMessage: 'Adjust the layout style of VitePress to adapt to different reading needs and screens.',
    titleAriaLabel: 'Layout Switch',
    titleScreenNavWarningMessage: 'No available layout can be switched in mobile screen.',
    optionFullWidth: 'Expand all',
    optionFullWidthAriaLabel: 'Expand all',
    optionFullWidthHelpMessage: 'The sidebar and content area occupy the entire width of the screen.',
    optionOnlySidebarFullWidth: 'Expand only sidebar',
    optionOnlySidebarFullWidthAriaLabel: 'Expand only sidebar',
    optionOnlySidebarFullWidthHelpMessage: 'Only the left and right sidebars occupy the entire width of the screen, and the width of the content area will remain the original width.',
    optionFitContentWidth: 'Fit content width',
    optionFitContentWidthAriaLabel: 'Fit content width',
    optionFitContentWidthHelpMessage: 'The width of the sidebar and content area will adapt to the width of the content, and the width of the content area will remain the original width.',
  },
  spotlight: {
    title: 'Spotlight',
    titleAriaLabel: 'Spotlight',
    titleHelpMessage: 'Highlight the line where the mouse is currently hovering in the content to optimize for users who may have reading and focusing difficulties.',
    titleScreenNavWarningMessage: 'Spotlight is not available in mobile screen temporarily.',
    optionOn: 'On',
    optionOnAriaLabel: 'On',
    optionOnHelpMessage: 'Turn on Spotlight.',
    optionOff: 'Off',
    optionOffAriaLabel: 'Off',
    optionOffHelpMessage: 'Turn off Spotlight.',
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
    titleHelpMessage: '调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境。',
    titleScreenNavWarningMessage: '移动端无可切换布局。',
    optionFullWidth: '全部展开',
    optionFullWidthAriaLabel: '全部展开',
    optionFullWidthHelpMessage: '侧边栏和内容区域占据整个屏幕的全部宽度。',
    optionOnlySidebarFullWidth: '仅侧边栏展开',
    optionOnlySidebarFullWidthAriaLabel: '仅侧边栏展开',
    optionOnlySidebarFullWidthHelpMessage: '仅左侧和右侧的侧边栏占据整个屏幕的全部宽度，正文内容区域宽度将维持原有宽度。',
    optionFitContentWidth: '自适应内容宽度',
    optionFitContentWidthAriaLabel: '自适应内容宽度',
    optionFitContentWidthHelpMessage: '侧边栏和内容区域宽度将自适应内容宽度，正文内容区域宽度将维持原有宽度。',
  },
  spotlight: {
    title: '聚光灯',
    titleAriaLabel: '聚光灯',
    titleHelpMessage: '支持在正文中高亮当前鼠标悬停的行和元素，以优化阅读和专注困难的用户的阅读体验。',
    titleScreenNavWarningMessage: '移动端暂不支持聚光灯。',
    optionOn: '开启',
    optionOnAriaLabel: '开启',
    optionOnHelpMessage: '开启聚光灯。',
    optionOff: '关闭',
    optionOffAriaLabel: '关闭',
    optionOffHelpMessage: '关闭聚光灯。',
  },
}
