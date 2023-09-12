import { cwd } from 'node:process'
import { defineConfig } from 'vitepress'
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nolebase/plugins' },
    ],
  },
  locales: {
    'root': {
      label: 'English',
      lang: 'en',
      link: '/pages/en/',
      title: 'Nólëbase Plugins',
      description: 'Great plugins that made from the creators of Nólëbase',
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
      title: 'Nólëbase 插件',
      description: '由 Nólëbase 的创作者们制作的优秀插件',
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
      // md.use(MarkdownItTokenTransform({
      //   transformToken: (token) => {
      //     switch (token.type) {
      //       case 'link_open':
      //         token.tag = 'LinkPreviewPopup'
      //         break
      //       case 'link_close':
      //         token.tag = 'LinkPreviewPopup'
      //     }
      //   },
      // }))
    },
  },
})
