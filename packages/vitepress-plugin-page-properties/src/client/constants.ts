import type { InjectionKey as VueInjectionKey } from 'vue'
import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-page-properties')
