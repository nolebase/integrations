import { h } from 'vue'

import { defineThemeConfig } from '@nolebase/unconfig-vitepress'
import { NuLazyDOMRiveCanvas } from '@nolebase/ui'

import IntegrationCard from './components/IntegrationCard.vue'
import HomeContent from './components/HomeContent.vue'

import './styles/vars.css'
import './styles/main.css'

export default defineThemeConfig<{
  tags: string[]
  authors: string[]
  progress: string[]
  createdAt: string
  updatedAt: string
  url1: string
}>({
  layout: {
    slots: {
      'layout-top': {
        node: h(NuLazyDOMRiveCanvas),
      },
    },
  },
  enhanceApp: ({ app }) => {
    app.component('IntegrationCard', IntegrationCard)
    app.component('HomeContent', HomeContent)
  },
  nolebase: {
    // enhancedReadabilities: {
    //   enable: true,
    //   options: {
    //     layoutSwitch: {
    //       defaultMode: 4,
    //     },
    //     spotlight: {
    //       defaultToggle: true,
    //     },
    //   },
    // },
    linkPreview: {
      enable: true,
    },
    gitChangelog: {
      enable: true,
      options: {
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
          {
            name: 'Nisekoi5',
            avatar: 'https://github.com/Nisekoi5.png',
            nameAliases: ['Nisekoi5'],
          },
        ],
      },
    },
    pageProperties: {
      enable: true,
      options:
      {
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
      },
    },
  },
})
