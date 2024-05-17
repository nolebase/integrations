import { argv, cwd, env } from 'node:process'

import { gray } from 'colorette'
import { type DefaultTheme, defineConfig } from 'vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta/vitepress'

import packageJSON from '../../package.json'
import { compilerOptions } from './twoslashConfig'

function noTwoslash() {
  return argv.some(v => v.includes('vitepress')) && argv.includes('dev')
}

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
        text: 'Markdown It Plugins',
        items: [
          {
            text: 'Bi-directional links',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/pages/en/integrations/markdown-it-bi-directional-links/' },
              { text: 'Getting Started', link: '/pages/en/integrations/markdown-it-bi-directional-links/getting-started' },
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
          {
            text: 'Inline Links Previewing',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/pages/en/integrations/vitepress-plugin-inline-link-preview/' },
              { text: 'Getting started', link: '/pages/en/integrations/vitepress-plugin-inline-link-preview/getting-started' },
              { text: 'Configuration', link: '/pages/en/integrations/vitepress-plugin-inline-link-preview/configuration' },
            ],
          },
          { text: 'Blinking highlight targeted heading', link: '/pages/en/integrations/vitepress-plugin-highlight-targeted-heading/' },
          {
            text: 'Git-based page histories',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/pages/en/integrations/vitepress-plugin-git-changelog/' },
              { text: 'Getting started', link: '/pages/en/integrations/vitepress-plugin-git-changelog/getting-started' },
              { text: 'Configure UI', link: '/pages/en/integrations/vitepress-plugin-git-changelog/configure-ui' },
              { text: 'Configure Vite Plugins', link: '/pages/en/integrations/vitepress-plugin-git-changelog/configure-vite-plugins' },
            ],
          },
          { text: 'Page properties', link: '/pages/en/integrations/vitepress-plugin-page-properties/' },
          { text: 'Page metadata generation', link: '/pages/en/integrations/vitepress-plugin-meta/' },
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
      {
        text: 'UI Components',
        items: [
          { text: 'Overview', link: '/pages/en/ui/' },
        ],
      },
      {
        text: 'Releasing',
        items: [
          {
            text: 'Migration guides',
            items: [
              {
                text: 'Migrate from v1 to v2',
                link: '/pages/en/releases/migrations/v1-to-v2',
              },
            ],
          },
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
          { text: 'Asciinema player', link: '/pages/en/ui/asciinema-player/' },
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
        text: 'Markdown It 插件',
        items: [
          {
            text: '双向链接',
            collapsed: true,
            items: [
              { text: '介绍', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/' },
              { text: '快速上手', link: '/pages/zh-CN/integrations/markdown-it-bi-directional-links/getting-started' },
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
          {
            text: '行内链接预览',
            collapsed: true,
            items: [
              { text: '介绍', link: '/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview/' },
              { text: '快速上手', link: '/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview/getting-started' },
              { text: '配置', link: '/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview/configuration' },
            ],
          },
          { text: '闪烁高亮当前的目标标题', link: '/pages/zh-CN/integrations/vitepress-plugin-highlight-targeted-heading/' },
          {
            text: '基于 Git 的页面历史',
            collapsed: true,
            items: [
              { text: '介绍', link: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog/' },
              { text: '快速上手', link: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog/getting-started' },
              { text: '配置 UI 组件', link: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog/configure-ui' },
              { text: '配置 Vite 插件', link: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog/configure-vite-plugins' },
            ],
          },
          { text: '页面属性', link: '/pages/zh-CN/integrations/vitepress-plugin-page-properties/' },
          { text: '页面元信息生成', link: '/pages/zh-CN/integrations/vitepress-plugin-meta/' },
          { text: '预览图片（社交媒体卡片）生成', link: '/pages/zh-CN/integrations/vitepress-plugin-og-image/' },
          { text: 'mark 元素增强', link: '/pages/zh-CN/integrations/vitepress-plugin-enhanced-mark/' },
          {
            text: '缩略图模糊哈希生成',
            collapsed: true,
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
      {
        text: '版本发布',
        items: [
          {
            text: '迁移指南',
            items: [
              {
                text: '自 v1 迁移至 v2',
                link: '/pages/zh-CN/releases/migrations/v1-to-v2',
              },
            ],
          },
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
          { text: 'Asciinema 播放器', link: '/pages/en/ui/asciinema-player/' },
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
  cleanUrls: true,
  ignoreDeadLinks: [
    // Site Config | VitePress
    // https://vitepress.dev/reference/site-config#ignoredeadlinks
    //
    // ignore all localhost links
    /^https?:\/\/localhost/,
  ],
  head: [
    // Proxying Plausible through Netlify | Plausible docs
    // https://plausible.io/docs/proxy/guides/netlify
    ['script', { 'defer': 'true', 'data-domain': 'nolebase-integrations.ayaka.io', 'data-api': '/api/v1/page-external-data/submit', 'src': '/assets/page-external-data/js/script.js' }],
  ],
  themeConfig: {
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nolebase/integrations' },
      { icon: 'discord', link: 'https://discord.gg/XuNFDcDZGj' },
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
          {
            text: packageJSON.version,
            items: [
              {
                text: 'Migrations',
                items: [
                  {
                    text: 'Migrate from v1 to v2',
                    link: '/pages/en/releases/migrations/v1-to-v2',
                  },
                ],
              },
            ],
          },
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
          {
            text: packageJSON.version,
            items: [
              {
                text: '迁移指南',
                items: [
                  {
                    text: '自 v1 迁移至 v2',
                    link: '/pages/zh-CN/releases/migrations/v1-to-v2',
                  },
                ],
              },
            ],
          },
        ],
        sidebar: sidebars['zh-CN'],
      },
    },
  },
  markdown: {
    codeTransformers: noTwoslash()
      ? []
      : [
          transformerTwoslash({
            errorRendering: 'hover',
            onTwoslashError(error, _, __, ___) {
              console.error('Twoslash Error:', (error as Error)?.message, '\n', (error as Error)?.stack ? gray(String((error as Error)?.stack)) : '')
            },
            twoslashOptions: compilerOptions,
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
      md.use(InlineLinkPreviewElementTransform)
    },
  },
  async transformHead(context) {
    let head = [...context.head]

    const returnedHead = await transformHeadMeta()(head, context)
    if (typeof returnedHead !== 'undefined')
      head = returnedHead

    return head
  },
  async buildEnd(siteConfig) {
    const newBuilder = buildEndGenerateOpenGraphImages({
      baseUrl: 'https://nolebase-integrations.ayaka.io',
      category: {
        byPathPrefix: [
          { prefix: '/pages/en/integrations/markdown-it-bi-directional-links', text: 'Markdown It Plugins: Bi-directional links' },
          { prefix: '/pages/en/integrations/markdown-it', text: 'Markdown It Plugins' },
          { prefix: '/pages/en/integrations/obsidian-plugin', text: 'Obsidian Plugins' },
          { prefix: '/pages/en/integrations/vitepress-plugin-inline-link-preview', text: 'VitePress Plugin: Inline Links Previewing' },
          { prefix: '/pages/en/integrations/vitepress-plugin-git-changelog', text: 'VitePress Plugin: Git-based page histories' },
          { prefix: '/pages/en/integrations/vitepress-plugin-thumbnail-hash', text: 'VitePress Plugin: Thumbnail hashing for images' },
          { prefix: '/pages/en/integrations/vitepress-plugin', text: 'VitePress Plugins' },
          { prefix: '/pages/en/integrations/', text: 'Integrations' },
          { prefix: '/pages/en/guide/', text: 'Guide' },
          { prefix: '/pages/en/ui/', text: 'UI Components' },
          { prefix: '/pages/en/', text: 'Documentations' },
          { prefix: '/pages/zh-CN/integrations/markdown-it-bi-directional-links', text: 'Markdown It 插件：双向链接' },
          { prefix: '/pages/zh-CN/integrations/markdown-it', text: 'Markdown It 插件' },
          { prefix: '/pages/zh-CN/integrations/obsidian-plugin', text: 'Obsidian 插件' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin-inline-link-preview', text: 'VitePress 插件：行内链接预览' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin-git-changelog', text: 'VitePress 插件：变更日志 及 文件历史' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin-thumbnail-hash', text: 'VitePress 插件：缩略图模糊哈希生成' },
          { prefix: '/pages/zh-CN/integrations/vitepress-plugin', text: 'VitePress 插件' },
          { prefix: '/pages/zh-CN/integrations/', text: '集成' },
          { prefix: '/pages/zh-CN/guide/', text: '指南' },
          { prefix: '/pages/zh-CN/ui/', text: 'UI 组件' },
          { prefix: '/pages/zh-CN/', text: '文档' },
        ],
        fallbackWithFrontmatter: true,
      },
    })

    await newBuilder(siteConfig)
  },
})
