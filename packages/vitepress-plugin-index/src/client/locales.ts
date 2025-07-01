import type { Locale } from './types'

import { defaultEnLocale, defaultZhCNLocale } from '../locales'

export {
  defaultEnLocale,
  defaultZhCNLocale,
}

export const defaultLocales: Record<string, Locale> = {
  'en-US': defaultEnLocale,
  'en': defaultEnLocale,
  'zh-CN': defaultZhCNLocale,
  'zh-Hans': defaultZhCNLocale,
  'zh': defaultZhCNLocale,
}
