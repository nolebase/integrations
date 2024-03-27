import { h } from 'vue'

import { NuLazyTeleportRiveCanvas } from '@nolebase/ui'
import { NolebasePluginSet, defineThemeUnconfig } from '@nolebase/unconfig-vitepress'

import IntegrationCard from './components/IntegrationCard.vue'
import HomeContent from './components/HomeContent.vue'

import 'virtual:uno.css'

import './styles/vars.css'
import './styles/main.css'

export default defineThemeUnconfig({
  layout: {
    slots: {
      'layout-top': {
        node: [
          () => h(NuLazyTeleportRiveCanvas),
        ],
      },
    },
  },
  enhanceApp: ({ app }) => {
    app.component('IntegrationCard', IntegrationCard)
    app.component('HomeContent', HomeContent)
  },
  pluginSets: [
    NolebasePluginSet({
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
    }),
  ],
})
