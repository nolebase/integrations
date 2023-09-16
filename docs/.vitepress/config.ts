import { cwd } from 'node:process'
import { defineConfig } from 'vitepress'
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nolebase/integrations' },
    ],
  },
  locales: {
    'root': {
      label: 'English',
      lang: 'en',
      link: '/pages/en/',
      title: 'Nólëbase Integrations',
      description: 'A collection of diverse documentation engineering tools',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/pages/en/' },
        ],
        sidebar: [
          {
            text: 'Markdown It Plugins',
            items: [
              { text: 'Bi-directional Links', link: '/pages/en/plugins/markdown-it-bi-directional-links/' },
            ],
          },
        ],
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/pages/zh-CN/',
      title: 'Nólëbase 集成',
      description: '多元化的文档工程工具合集',
      themeConfig: {
        nav: [
          { text: '首页', link: '/pages/zh-CN/' },
        ],
        sidebar: [
          {
            text: 'Markdown It 插件',
            items: [
              { text: '双向链接', link: '/pages/zh-CN/plugins/markdown-it-bi-directional-links/' },
            ],
          },
        ],
      },
    },
  },
  markdown: {
    config(md) {
      md.use(MarkdownItBiDirectionalLinks({
        dir: cwd(),
      }))
    },
  },
})
