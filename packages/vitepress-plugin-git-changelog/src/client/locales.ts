import type { Locale } from './types'

import { defaultEnLocale, defaultRuLocale, defaultZhCNLocale, defaultZhHantLocale } from '../locales'

export {
  defaultEnLocale,
  defaultRuLocale,
  defaultZhCNLocale,
  defaultZhHantLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
  'ru-RU': defaultRuLocale,
  'ru': defaultRuLocale,
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'zh-TW': defaultZhHantLocale,
  'zh-HK': defaultZhHantLocale,
  'zh-Hant': defaultZhHantLocale,
}
