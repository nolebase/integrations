import { defaultEnLocale, defaultZhCNLocale } from '../locales'

const defaultEnLocaleAsLocale = defaultEnLocale as Locale
const defaultZhCNLocaleAsLocale = defaultZhCNLocale as Locale

export interface Locale extends Record<string, any> {
  gitChangelogMarkdownSectionTitles?: {
    changelog?: string
    contributors?: string
  }
}

export {
  defaultEnLocaleAsLocale as defaultEnLocale,
  defaultZhCNLocaleAsLocale as defaultZhCNLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
}
