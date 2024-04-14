const defaultEnLocale: Locale = {
  gitChangelogMarkdownSectionTitles: {
    changelog: 'Changelog',
    contributors: 'Contributors',
  },
}

const defaultZhCNLocale: Locale = {
  gitChangelogMarkdownSectionTitles: {
    changelog: '页面历史',
    contributors: '贡献者',
  },
}

export interface Locale extends Record<string, any> {
  gitChangelogMarkdownSectionTitles?: {
    changelog?: string
    contributors?: string
  }
}

export {
  defaultEnLocale,
  defaultZhCNLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
}
