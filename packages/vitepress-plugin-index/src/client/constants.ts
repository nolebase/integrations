import type { InjectionKey as VueInjectionKey } from 'vue'

import type { Options } from './types'

import { defaultLocales } from './locales'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-index')

export const defaultNumCommitHashLetters = 7

export const defaultOptions: Options = {
  locales: defaultLocales,
}
