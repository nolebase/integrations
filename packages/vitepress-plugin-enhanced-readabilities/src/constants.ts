import type { InjectionKey as VueInjectionKey } from 'vue'
import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-enhanced-readabilities')

export const LayoutSwitchModeStorageKey = 'vitepress-nolebase-enhanced-readabilities-layout-switch-mode'
export const LayoutSwitchMaxWidthStrategyStorageKey = 'vitepress-nolebase-enhanced-readabilities-layout-switch-max-width-strategy'
export const ContentLayoutMaxWidthStorageKey = 'vitepress-nolebase-enhanced-readabilities-content-layout-max-width'
export const PageLayoutMaxWidthStorageKey = 'vitepress-nolebase-enhanced-readabilities-page-layout-max-width'
export const SpotlightToggledStorageKey = 'vitepress-nolebase-enhanced-readabilities-spotlight-mode'
