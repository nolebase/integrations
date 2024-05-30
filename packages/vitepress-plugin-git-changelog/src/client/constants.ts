import type { InjectionKey as VueInjectionKey } from 'vue'
import { defaultLocales } from './locales'
import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-git-changelog')

export const defaultNumCommitHashLetters = 7

export const defaultOptions: Options = {
  numCommitHashLetters: defaultNumCommitHashLetters,
  locales: defaultLocales,
}
