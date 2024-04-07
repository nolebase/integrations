import { cwd, env } from 'node:process'

import { type DefaultTheme, defineConfig } from 'vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { ElementTransform } from '@nolebase/markdown-it-element-transform'
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'

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
        text: 'Markdown It Plugins',
        items: [
          {
            text: 'Bi-directional links',
            collapsed: true,
            items: [
              { text: 'Getting Started', link: '/pages/en/integrations/markdown-it-bi-directional-links/' },
              { text: 'Syntax', link: '/pages/en/integrations/markdown-it-bi-directional-links/syntax' },
            ],
          },
          { text: 'Elements Transformation', link: '/pages/en/integrations/markdown-it-element-transform/' },
          { text: 'Lazy loading blurred thumbnails', link: '/pages/en/integrations/markdown-it-unlazy-img/' },
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
          { text: 'Enhanced mark elements', link: '/pages/en/integrations/vitepress-plugin-enhanced-mark/' },
          {
            text: 'Thumbnail hashing for images',
            collapsed: true,
            items: [
              { text: 'Usage', link: '/pages/en/integrations/vitepress-plugin-thumbnail-hash/' },
              { text: 'Try ThumbHash', link: '/pages/en/integrations/vitepress-plugin-thumbnail-hash/thumbhash' },
            ],
          },
        ],
      },
      {
        text: 'Obsidian Plugins',
        items: [
          { text: 'UnoCSS', link: '/pages/en/integrations/obsidian-plugin-unocss/' },
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
        text: 'Inputs',
        items: [
          { text: 'Radio Group (Horizontal)', link: '/pages/en/ui/input-horizontal-radio-group/' },
          { text: 'Slider', link: '/pages/en/ui/input-slider/' },
        ],
      },
      {
        text: 'Animations',
        items: [
          { text: 'Rive Canvas (Lazy Teleport)', link: '/pages/en/ui/lazy-teleport-rive-canvas/' },
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
        text: 'Markdown It 插件',
        items: [
          {
            text: '双向链接',
            collapsed: true,
            items: [
              { text: '快速上手', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/' },
              { text: '语法', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/syntax' },
            ],
          },
          { text: '元素转换', link: '/pages/zh-CN/integrations/markdown-it-element-transform/' },
          { text: '懒加载模糊缩略图', link: '/pages/zh-CN/integrations/markdown-it-unlazy-img/' },
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
          { text: 'mark 元素增强', link: '/pages/zh-CN/integrations/vitepress-plugin-enhanced-mark/' },
          {
            text: '缩略图模糊哈希生成',
            items: [
              { text: '用法', link: '/pages/zh-CN/integrations/vitepress-plugin-thumbnail-hash/' },
              { text: '尝试 ThumbHash', link: '/pages/zh-CN/integrations/vitepress-plugin-thumbnail-hash/thumbhash' },
            ],
          },
        ],
      },
      {
        text: 'Obsidian 插件',
        items: [
          { text: 'UnoCSS', link: '/pages/zh-CN/integrations/obsidian-plugin-unocss/' },
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
        text: '输入',
        items: [
          { text: '多个单选（水平）', link: '/pages/zh-CN/ui/input-horizontal-radio-group/' },
          { text: '滑块', link: '/pages/zh-CN/ui/input-slider/' },
        ],
      },
      {
        text: '动画',
        items: [
          { text: 'Rive Canvas（懒 Teleport）', link: '/pages/zh-CN/ui/lazy-teleport-rive-canvas/' },
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
  vue: {
    template: {
      transformAssetUrls: {
        video: ['src', 'poster'],
        source: ['src'],
        img: ['src'],
        image: ['xlink:href', 'href'],
        use: ['xlink:href', 'href'],
        NolebaseUnlazyImg: ['src'],
      },
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
    codeTransformers: [
      transformerTwoslash({
        errorRendering: 'hover',
      }),
    ],
    preConfig(md) {
      md.use(BiDirectionalLinks({
        dir: cwd(),
      }))
      md.use(UnlazyImages(), {
        imgElementTag: 'NolebaseUnlazyImg',
      })
    },
    config(md) {
      md.use(MarkdownItFootnote)
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
        }
      })())
    },
  },
  async buildEnd(siteConfig) {
    await buildEndGenerateOpenGraphImages({
      baseUrl: 'https://nolebase-integrations.ayaka.io',
      category: {
        byPathPrefix: [
          { prefix: '/pages/en/integrations/markdown-it', text: 'Markdown It Plugins' },
          { prefix: '/pages/en/integrations/obsidian-plugin', text: 'Obsidian Plugins' },
          { prefix: '/pages/en/integrations/vitepress-plugin', text: 'VitePress Plugins' },
          { prefix: '/pages/en/integrations/vitepress-plugin/vitepress-plugin-thumbnail-hash', text: 'VitePress Plugin: Thumbnail hashing for images' },
          { prefix: '/pages/en/integrations/', text: 'Integrations' },
          { prefix: '/pages/en/guide/', text: 'Guide' },
          { prefix: '/pages/en/ui/', text: 'UI Components' },
          { prefix: '/pages/en/', text: 'Documentations' },
          { prefix: '/pages/zh-CN/integrations/markdown-it', text: 'Markdown It 插件' },
          { prefix: '/pages/zh-CN/integrations/obsidian-plugin', text: 'Obsidian 插件' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin', text: 'VitePress 插件' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin/vitepress-plugin-thumbnail-hash', text: 'VitePress 插件：缩略图模糊哈希生成' },
          { prefix: '/pages/zh-CN/integrations/', text: '集成' },
          { prefix: '/pages/zh-CN/guide/', text: '指南' },
          { prefix: '/pages/zh-CN/ui/', text: 'UI 组件' },
          { prefix: '/pages/zh-CN/', text: '文档' },
        ],
        fallbackWithFrontmatter: true,
      },
    })(siteConfig)
  },
})
