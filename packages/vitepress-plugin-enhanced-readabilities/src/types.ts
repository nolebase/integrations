export enum LayoutMode {
  FullWidth = 1,
  OnlySidebarFullWidth = 2,
  FitContentWidth = 3,
}

export const injectionKey = Symbol('vitepress-nolebase-enhanced-readabilities')

export interface Locale {
  title?: {
    title?: string
    titleAriaLabel?: string
  }
  layoutSwitch?: {
    title?: string
    titleAriaLabel?: string
    titleScreenNavWarningMessage?: string
    optionFullWidth?: string
    optionFullWidthAriaLabel?: string
    optionOnlySidebarFullWidth?: string
    optionOnlySidebarFullWidthAriaLabel?: string
    optionFitContentWidth?: string
    optionFitContentWidthAriaLabel?: string
  }
  inlineHighlight?: {
    title?: string
    titleAriaLabel?: string
    titleScreenNavWarningMessage?: string
    optionOn?: string
    optionOnAriaLabel?: string
    optionOff?: string
    optionOffAriaLabel?: string
  }
}

export interface EnhancedReadabilitiesOptions {
  locales?: Record<string, Locale>
}
