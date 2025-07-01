import type { Locale } from './types'

import { defaultEnLocale, defaultZhCNLocale } from '../locales'

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
