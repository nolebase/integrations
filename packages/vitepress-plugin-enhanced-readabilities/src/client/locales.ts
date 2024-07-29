import { defaultEnLocale, defaultRuLocale, defaultZhCNLocale } from '../locales'
import type { Locale } from './types'

export {
  defaultEnLocale,
  defaultRuLocale,
  defaultZhCNLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
  'ru-RU': defaultRuLocale,
  'ru': defaultRuLocale,
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
}
