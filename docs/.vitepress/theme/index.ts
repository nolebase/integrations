import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import {
  InjectionKey as NolebaseGitChangelogInjectionKey,
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

import IntegrationCard from './components/IntegrationCard.vue'
import HomeContent from './components/HomeContent.vue'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(NolebaseHighlightTargetedHeading),
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

    app.use(NolebaseInlineLinkPreviewPlugin)

    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.SidebarWidthAdjustableOnly,
      },
      spotlight: {
        defaultToggle: true,
      },
    })

    app.use(NolebaseGitChangelogPlugin)
    app.provide(NolebaseGitChangelogInjectionKey, {
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
            key: 'authors',
            type: 'plain',
            title: 'Authors',
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
            key: 'authors',
            type: 'plain',
            title: '作者',
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
        ],
      },
    })
  },
}

export default Theme
