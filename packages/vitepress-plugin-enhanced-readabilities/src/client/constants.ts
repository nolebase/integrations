import type { InjectionKey as VueInjectionKey } from 'vue'

import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('vitepress-nolebase-enhanced-readabilities')

export const LayoutSwitchModeStorageKey = 'vitepress-nolebase-enhanced-readabilities-layout-switch-mode'
export const LayoutSwitchMaxWidthStrategyStorageKey = 'vitepress-nolebase-enhanced-readabilities-layout-switch-max-width-strategy'
export const ContentLayoutMaxWidthStorageKey = 'vitepress-nolebase-enhanced-readabilities-content-layout-max-width'
export const PageLayoutMaxWidthStorageKey = 'vitepress-nolebase-enhanced-readabilities-page-layout-max-width'

export const SpotlightToggledStorageKey = 'vitepress-nolebase-enhanced-readabilities-spotlight-mode'
export const SpotlightStylesStorageKey = 'vitepress-nolebase-enhanced-readabilities-spotlight-styles'

export enum LayoutMode {
  FullWidth = 1,
  Original = 3,
  SidebarWidthAdjustableOnly = 4,
  BothWidthAdjustable = 5,
}

export const supportedLayoutModes = [
  LayoutMode.FullWidth,
  LayoutMode.Original,
  LayoutMode.SidebarWidthAdjustableOnly,
  LayoutMode.BothWidthAdjustable,
]

export enum SpotlightStyle {
  Under = 1,
  Aside = 2,
}

export const supportedSpotlightStyles = [
  SpotlightStyle.Under,
  SpotlightStyle.Aside,
]
