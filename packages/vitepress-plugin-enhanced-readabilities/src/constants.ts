import type { InjectionKey as VueInjectionKey } from 'vue'
import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-enhanced-readabilities')

export const LayoutSwitchModeStorageKey = 'vitepress-nolebase-enhanced-readabilities-layout-switch-mode'
export const SpotlightToggledStorageKey = 'vitepress-nolebase-enhanced-readabilities-spotlight-mode'
