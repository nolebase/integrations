import type { DefaultTheme } from 'vitepress'

export interface PageItem extends Omit<DefaultTheme.SidebarItem, 'text'> {
  title: string
  category: string
  locale: string
  sourceFilePath: string
  frontmatter: Record<string, any>
}
