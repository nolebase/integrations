import { createI18n } from '@nolebase/ui'

import { InjectionKey } from '../constants'
import { defaultEnLocale, defaultLocales } from '../locales'

export const useI18n = createI18n(InjectionKey, defaultLocales, defaultEnLocale)
