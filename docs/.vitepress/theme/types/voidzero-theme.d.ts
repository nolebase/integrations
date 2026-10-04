declare module '@voidzero-dev/vitepress-theme' {
  import type { Theme } from 'vitepress'
  import type { InjectionKey } from 'vue'

  export interface ThemeContext {
    footerBg: string
    logoAlt: string
    logoDark: string
    logoLight: string
    monoIcon: string
  }

  export const themeContextKey: InjectionKey<ThemeContext>
  export const VoidZeroTheme: Theme
  export default VoidZeroTheme
}
