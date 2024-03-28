import { cwd, env } from 'node:process'
import { join, relative } from 'node:path'
import { type DefaultTheme, defineConfig } from 'vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import type { Options as ElementTransformOptions } from '@nolebase/markdown-it-element-transform'
import { ElementTransform } from '@nolebase/markdown-it-element-transform'
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image'

export const sidebars: Record<string, DefaultTheme.Sidebar> = {
  'en': {
    '/': [
      {
        text: 'Guides',
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
        text: 'UI Components',
        items: [
          { text: 'Overview', link: '/pages/en/ui/' },
        ],
      },
    ],
    '/pages/en/integrations/': [
      {
        text: 'Integrations',
        items: [
          { text: 'Overview', link: '/pages/en/integrations/' },
        ],
      },
      {
        text: 'Obsidian Plugins',
        items: [
          { text: 'UnoCSS', link: '/pages/en/integrations/obsidian-plugin-unocss/' },
        ],
      },
      {
        text: 'Markdown It Plugins',
        items: [
          { text: 'Bi-directional links', link: '/pages/en/integrations/markdown-it-bi-directional-links/' },
          { text: 'Elements Transformation', link: '/pages/en/integrations/markdown-it-element-transform/' },
        ],
      },
      {
        text: 'VitePress Plugins',
        items: [
          { text: 'Enhanced Readabilities', link: '/pages/en/integrations/vitepress-plugin-enhanced-readabilities/' },
          { text: 'Inline Links Previewing', link: '/pages/en/integrations/vitepress-plugin-inline-link-preview/' },
          { text: 'Blinking highlight targeted heading', link: '/pages/en/integrations/vitepress-plugin-highlight-targeted-heading/' },
          { text: 'Changelog & File history', link: '/pages/en/integrations/vitepress-plugin-git-changelog/' },
          { text: 'Page properties', link: '/pages/en/integrations/vitepress-plugin-page-properties/' },
          { text: 'Previewing image (social media card) generation', link: '/pages/en/integrations/vitepress-plugin-og-image/' },
        ],
      },
    ],
    '/pages/en/ui/': [
      {
        text: 'UI Components',
        items: [
          { text: 'Overview', link: '/pages/en/ui/' },
        ],
      },
      {
        text: 'Actions',
        items: [
          { text: 'Button', link: '/pages/en/ui/button/' },
        ],
      },
      {
        text: 'Animations',
        items: [
          { text: 'Rive Canvas (Lazy Teleport)', link: '/pages/en/ui/lazyteleportrivecanvas/' },
        ],
      },
    ],
  },
  'zh-CN': {
    '/': [
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
        text: 'UI 组件',
        items: [
          { text: '概览', link: '/pages/zh-CN/ui/' },
        ],
      },
    ],
    '/pages/zh-CN/integrations/': [
      {
        text: '集成',
        items: [
          { text: '概览', link: '/pages/zh-CN/integrations/' },
        ],
      },
      {
        text: 'Obsidian 插件',
        items: [
          { text: 'UnoCSS', link: '/pages/zh-CN/integrations/obsidian-plugin-unocss/' },
        ],
      },
      {
        text: 'Markdown It 插件',
        items: [
          { text: '双向链接', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/' },
          { text: '元素转换', link: '/pages/zh-CN/integrations/markdown-it-element-transform/' },
        ],
      },
      {
        text: 'VitePress 插件',
        items: [
          { text: '阅读增强', link: '/pages/zh-CN/integrations/vitepress-plugin-enhanced-readabilities/' },
          { text: '行内链接预览', link: '/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview/' },
          { text: '闪烁高亮当前的目标标题', link: '/pages/zh-CN/integrations/vitepress-plugin-highlight-targeted-heading/' },
          { text: '变更日志 及 文件历史', link: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog/' },
          { text: '页面属性', link: '/pages/zh-CN/integrations/vitepress-plugin-page-properties/' },
          { text: '预览图片（社交媒体卡片）生成', link: '/pages/zh-CN/integrations/vitepress-plugin-og-image/' },
        ],
      },
    ],
    '/pages/zh-CN/ui/': [
      {
        text: 'UI 组件',
        items: [
          { text: '概览', link: '/pages/zh-CN/ui/' },
        ],
      },
      {
        text: '操作',
        items: [
          { text: '按钮', link: '/pages/zh-CN/ui/button/' },
        ],
      },
      {
        text: '动画',
        items: [
          { text: 'Rive Canvas（懒 Teleport）', link: '/pages/zh-CN/ui/lazyteleportrivecanvas/' },
        ],
      },
    ],
  },
}

function getVueProdHydrationMismatchDetailsFlag() {
  if (!env) {
    console.warn('WARNING: env is not available when trying to get Vue Prod Hydration Mismatch Details Flag')
    throw new Error('env is not available')
  }

  return !!env.VUE_PROD_HYDRATION_MISMATCH_DETAILS_FLAG
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: getVueProdHydrationMismatchDetailsFlag(),
    },
  },
  lastUpdated: true,
  themeConfig: {
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nolebase/integrations' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
  },
  buildConcurrency: 1000,
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
          { text: 'UI Components', link: '/pages/en/ui/' },
        ],
        sidebar: sidebars.en,
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
          { text: 'UI 组件', link: '/pages/zh-CN/ui/' },
        ],
        sidebar: sidebars['zh-CN'],
      },
    },
  },
  markdown: {
    config(md) {
      md.use(MarkdownItFootnote)
      md.use(BiDirectionalLinks({
        dir: cwd(),
      }))

      md.use(ElementTransform, (() => {
        let transformNextLinkCloseToken = false

        return {
          transform(token) {
            switch (token.type) {
              case 'link_open':
                if (token.attrGet('class') !== 'header-anchor') {
                  token.tag = 'VPNolebaseInlineLinkPreview'
                  transformNextLinkCloseToken = true
                }
                break
              case 'link_close':
                if (transformNextLinkCloseToken) {
                  token.tag = 'VPNolebaseInlineLinkPreview'
                  transformNextLinkCloseToken = false
                }

                break
            }
          },
        } as ElementTransformOptions
      })())
    },
    codeTransformers: [
      transformerTwoslash({
        errorRendering: 'hover',
      }),
    ],
  },
  async buildEnd(siteConfig) {
    await buildEndGenerateOpenGraphImages({
      domain: 'https://nolebase-integrations.ayaka.io',
      category: {
        customGetter: (page) => {
          if (page.locale === 'root') {
            const englishDocPath = relative(join('pages', 'en'), page.sourceFilePath.replace(/^\//, ''))
            if (englishDocPath.startsWith('guide'))
              return 'Guide'

            if (englishDocPath.startsWith('integrations')) {
              const englishIntegrationsDocPath = relative(join('pages', 'en', 'integrations'), page.sourceFilePath.replace(/^\//, ''))

              if (englishIntegrationsDocPath.startsWith('markdown-it'))
                return 'Markdown It Plugins'
              if (englishIntegrationsDocPath.startsWith('obsidian-plugin'))
                return 'Obsidian Plugins'
              if (englishIntegrationsDocPath.startsWith('vitepress-plugin'))
                return 'VitePress Plugins'

              return 'Integrations'
            }

            if (englishDocPath.startsWith('ui'))
              return 'UI Components'

            return 'Documentations'
          }

          if (page.locale === 'zh-CN') {
            const englishDocPath = relative(join('pages', 'zh-CN'), page.sourceFilePath.replace(/^\//, ''))
            if (englishDocPath.startsWith('guide'))
              return '指南'

            if (englishDocPath.startsWith('integrations')) {
              const englishIntegrationsDocPath = relative(join('pages', 'zh-CN', 'integrations'), page.sourceFilePath.replace(/^\//, ''))

              if (englishIntegrationsDocPath.startsWith('markdown-it'))
                return 'Markdown It 插件'
              if (englishIntegrationsDocPath.startsWith('obsidian-plugin'))
                return 'Obsidian 插件'
              if (englishIntegrationsDocPath.startsWith('vitepress-plugin'))
                return 'VitePress 插件'

              return '集成'
            }

            if (englishDocPath.startsWith('ui'))
              return 'UI 组件'

            return '文档'
          }

          return page.frontmatter.category ?? ''
        },
      },
    })(siteConfig)
  },
})
