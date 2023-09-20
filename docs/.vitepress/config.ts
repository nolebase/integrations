import { cwd } from 'node:process'
import { defineConfig } from 'vitepress'
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'
import MarkdownItElementTransform from '@nolebase/markdown-it-element-transform'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  themeConfig: {
    outline: 'deep',
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
          { text: 'Guide', link: '/pages/en/guide/getting-started' },
          { text: 'Integrations', link: '/pages/en/integrations/' },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'Getting Started', link: '/pages/en/guide/getting-started' },
            ],
          },
          {
            text: 'Integrations',
            items: [
              { text: 'Overview', link: '/pages/en/integrations/' },
            ],
          },
          {
            text: 'Markdown It Plugins',
            items: [
              { text: 'Bi-directional links', link: '/pages/en/integrations/markdown-it-bi-directional-links/' },
            ],
          },
          {
            text: 'VitePress Plugins',
            items: [
              { text: 'Enhanced Readabilities', link: '/pages/en/integrations/vitepress-plugin-enhanced-readabilities/' },
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
          { text: '指南', link: '/pages/zh-CN/guide/getting-started' },
          { text: '集成', link: '/pages/zh-CN/integrations/' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '如何开始', link: '/pages/zh-CN/guide/getting-started' },
            ],
          },
          {
            text: '集成',
            items: [
              { text: '概览', link: '/pages/zh-CN/integrations/' },

            ],
          },
          {
            text: 'Markdown It 插件',
            items: [
              { text: '双向链接', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/' },
            ],
          },
          {
            text: 'VitePress 插件',
            items: [
              { text: '阅读增强', link: '/pages/zh-CN/integrations/vitepress-plugin-enhanced-readabilities/' },
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
      md.use(MarkdownItElementTransform({
        transformToken(token) {
          switch (token.type) {
            case 'link_open':
              token.tag = 'VPNolebaseInlinePreviewLink'
              break
            case 'link_close':
              token.tag = 'VPNolebaseInlinePreviewLink'
          }
        },
      }))
    },
  },
})
