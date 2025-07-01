import type { DefaultTheme } from 'vitepress'

import { argv, cwd, env } from 'node:process'

import MarkdownItFootnote from 'markdown-it-footnote'

import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta/vitepress'
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { gray } from 'colorette'
import { defineConfig } from 'vitepress'

import packageJSON from '../../package.json'

import { compilerOptions } from './twoslashConfig'

function noTwoslash() {
  return argv.some(v => v.includes('vitepress')) && argv.includes('dev')
}

export const sidebars: Record<string, DefaultTheme.SidebarItem[] | DefaultTheme.SidebarMulti> = {
  'en': {
    '/pages/en/': calculateSidebar(['pages/en/guide', 'pages/en/integrations', 'pages/en/releases'], undefined, { '/': 2 }),
    '/pages/en/ui/': calculateSidebar(['pages/en/ui'], undefined, { '/': 2 }),
  } as DefaultTheme.SidebarMulti,
  'zh-CN': {
    '/pages/zh-CN/': calculateSidebar(['pages/zh-CN/guide', 'pages/zh-CN/integrations', 'pages/zh-CN/releases'], undefined, { '/': 2 }),
    '/pages/zh-CN/ui/': calculateSidebar(['pages/zh-CN/ui'], undefined, { '/': 2 }),
  } as DefaultTheme.SidebarMulti,
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
    // Only enable this on debug component style
    // externalLinkIcon: true,
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
          {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/pages/en/guide/getting-started' },
              { text: 'Recent Updated', link: '/pages/en/recent-updates' },
            ],
          },
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
                  {
                    text: 'Migrate from v2 to v3',
                    link: '/pages/en/releases/migrations/v2-to-v3',
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
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/pages/zh-CN/guide/getting-started' },
              { text: '最近更新', link: '/pages/zh-CN/recent-updates' },
            ],
          },
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
                  {
                    text: '自 v2 迁移至 v3',
                    link: '/pages/zh-CN/releases/migrations/v2-to-v3',
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
    languages: [
      'javascript',
      'typescript',
      'js',
      'ts',
      'shell',
      'bash',
      'json',
    ],
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
