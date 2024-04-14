import { defaultEnLocale, defaultZhCNLocale } from '../locales'
import type { Locale } from './types'

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
