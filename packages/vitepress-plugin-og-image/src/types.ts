import type { DefaultTheme } from 'vitepress'

export interface PageItem extends DefaultTheme.SidebarItem {
  text: string
  category?: string
  locale: string
}
