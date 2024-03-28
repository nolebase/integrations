import type { Locale } from './types'

import enLocale from './locales/en.yaml'
import zhCNLocale from './locales/zh-CN.yaml'

export const defaultEnLocale = enLocale as Locale
export const defaultZhCNLocale = zhCNLocale as Locale

export const defaultLocales = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
}
