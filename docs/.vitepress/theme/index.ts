import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import {
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesPlugin,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import {
  NolebaseGitChangelogPlugin,
} from '@nolebase/vitepress-plugin-git-changelog/client'

import {
  NolebasePagePropertiesPlugin,
} from '@nolebase/vitepress-plugin-page-properties/client'

import 'virtual:uno.css'

import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css'
import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import '@nolebase/vitepress-plugin-page-properties/client/style.css'

import './styles/vars.css'
import './styles/main.css'

import type { Theme } from 'vitepress'
import IntegrationCard from './components/IntegrationCard.vue'
import HomeContent from './components/HomeContent.vue'
import RiveCanvas from './components/LazyRiveDataCanvas.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(NolebaseHighlightTargetedHeading),
        h(RiveCanvas),
      ],
      'nav-bar-content-after': () => [
        h(NolebaseEnhancedReadabilitiesMenu),
      ],
      'nav-screen-content-after': () => [
        h(NolebaseEnhancedReadabilitiesScreenMenu),
      ],
    })
  },
  enhanceApp({ app }) {
    app.component('IntegrationCard', IntegrationCard)
    app.component('HomeContent', HomeContent)

    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.SidebarWidthAdjustableOnly,
      },
      spotlight: {
        defaultToggle: true,
      },
    })
    app.use(NolebaseInlineLinkPreviewPlugin)
    app.use(NolebaseGitChangelogPlugin, {
      mapContributors: [
        {
          name: 'Neko',
          avatar: 'https://github.com/nekomeowww.png',
          nameAliases: ['Neko Ayaka', 'Ayaka Neko'],
          emailAliases: ['neko@ayaka.moe'],
        },
        {
          name: 'Rizumu',
          avatar: 'https://github.com/LittleSound.png',
          nameAliases: ['Rizumu Ayaka', 'Ayaka Rizumu'],
          emailAliases: ['rizumu@ayaka.moe'],
        },
      ],
    })

    app.use(NolebasePagePropertiesPlugin<{
      tags: string[]
      authors: string[]
      progress: string[]
      createdAt: string
      updatedAt: string
      url1: string
    }>(), {
      properties: {
        'en': [
          {
            key: 'tags',
            type: 'tags',
            title: 'Tags',
          },
          {
            key: 'progress',
            type: 'progress',
            title: 'Progress',
          },
          {
            key: 'createdAt',
            type: 'datetime',
            title: 'Created at',
            formatAsFrom: true,
            dateFnsLocaleName: 'enUS',
          },
          {
            key: 'updatedAt',
            type: 'datetime',
            title: 'Updated at',
            formatAsFrom: true,
            dateFnsLocaleName: 'enUS',
          },
          {
            key: 'url1',
            type: 'link',
            title: 'URL 1',
          },
          {
            key: 'wordsCount',
            type: 'dynamic',
            title: 'Word count',
            options: {
              type: 'wordsCount',
            },
          },
          {
            key: 'readingTime',
            type: 'dynamic',
            title: 'Reading time',
            options: {
              type: 'readingTime',
              dateFnsLocaleName: 'enUS',
            },
          },
        ],
        'zh-CN': [
          {
            key: 'tags',
            type: 'tags',
            title: '标签',
          },
          {
            key: 'progress',
            type: 'progress',
            title: '进度',
          },
          {
            key: 'createdAt',
            type: 'datetime',
            title: '创建时间',
            formatAsFrom: true,
            dateFnsLocaleName: 'zhCN',
          },
          {
            key: 'updatedAt',
            type: 'datetime',
            title: '更新时间',
            formatAsFrom: true,
            dateFnsLocaleName: 'zhCN',
          },
          {
            key: 'url1',
            type: 'link',
            title: '链接 1',
          },
          {
            key: 'wordsCount',
            type: 'dynamic',
            title: '字数',
            options: {
              type: 'wordsCount',
            },
          },
          {
            key: 'readingTime',
            type: 'dynamic',
            title: '阅读时间',
            options: {
              type: 'readingTime',
              dateFnsLocaleName: 'zhCN',
            },
          },
        ],
      },
    })
  },
} as Theme
