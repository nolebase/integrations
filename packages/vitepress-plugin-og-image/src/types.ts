import type { DefaultTheme } from 'vitepress'

export interface PageItem extends DefaultTheme.SidebarItem {
  title: string
  category: string
  locale: string
  sourceFilePath: string
  frontmatter: Record<string, any>
}
