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
    titleHelpMessage?: string
    titleScreenNavWarningMessage?: string
    optionFullWidth?: string
    optionFullWidthAriaLabel?: string
    optionFullWidthHelpMessage?: string
    optionOnlySidebarFullWidth?: string
    optionOnlySidebarFullWidthAriaLabel?: string
    optionOnlySidebarFullWidthHelpMessage?: string
    optionFitContentWidth?: string
    optionFitContentWidthAriaLabel?: string
    optionFitContentWidthHelpMessage?: string
  }
  inlineHighlight?: {
    title?: string
    titleAriaLabel?: string
    titleHelpMessage?: string
    titleScreenNavWarningMessage?: string
    optionOn?: string
    optionOnAriaLabel?: string
    optionOnHelpMessage?: string
    optionOff?: string
    optionOffAriaLabel?: string
    optionOffHelpMessage?: string
  }
}

export interface EnhancedReadabilitiesOptions {
  locales?: Record<string, Locale>
}
