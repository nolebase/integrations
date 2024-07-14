import { defaultEnLocale, defaultZhCNLocale, defaultRuLocale } from '../locales'
import type { Locale } from './types'

export {
  defaultEnLocale,
  defaultZhCNLocale,
  defaultRuLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
  'ru-RU': defaultRuLocale,
  'ru': defaultRuLocale,
}
