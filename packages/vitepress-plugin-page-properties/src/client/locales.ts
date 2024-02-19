import type { Locale } from './types'

export const defaultEnLocale: Locale = {
  pageProperties: {
    wordsCount: '{{wordsCount}} words',
  },
}

export const defaultZhCNLocale: Locale = {
  pageProperties: {
    wordsCount: '{{wordsCount}} 字',
  },
}

export const defaultLocales = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
}
