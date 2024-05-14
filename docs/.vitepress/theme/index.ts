import { type Plugin, h } from 'vue'

import { MotionPlugin } from '@vueuse/motion'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import { NuLazyTeleportRiveCanvas } from '@nolebase/ui'
import { defineThemeUnconfig } from '@nolebase/unconfig-vitepress'
import { NolebasePluginPreset } from '@nolebase/unconfig-vitepress/plugins'

import VPHeroImageLogo from './components/VPHeroImageLogo.vue'
import IntegrationCard from './components/IntegrationCard.vue'
import HomeContent from './components/HomeContent.vue'
import ThumbhashPreview from './components/ThumbhashPreview.vue'
import NavHeader from './components/NavHeader.vue'

import 'virtual:uno.css'

import '@shikijs/vitepress-twoslash/style.css'
import 'asciinema-player/dist/bundle/asciinema-player.css'

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
      'home-hero-before': {
        node: [
          () => h(NavHeader),
        ],
      },
      'home-hero-image': {
        node: [
          () => h(VPHeroImageLogo),
        ],
      },
    },
  },
  enhanceApp: ({ app }) => {
    app.component('IntegrationCard', IntegrationCard)
    app.component('HomeContent', HomeContent)
    app.component('ThumbhashPreview', ThumbhashPreview)

    app.use(TwoslashFloatingVue as Plugin)
    app.use(MotionPlugin as Plugin)
  },
  pluginPresets: [
    NolebasePluginPreset({
      gitChangelog: {
        enable: true,
        options: {
          mapContributors: [
            {
              name: 'Neko',
              avatar: 'https://github.com/nekomeowww.png',
              mapByNameAliases: ['Neko Ayaka', 'Ayaka Neko'],
              mapByEmailAliases: ['neko@ayaka.moe'],
            },
            {
              name: 'Rizumu',
              avatar: 'https://github.com/LittleSound.png',
              mapByNameAliases: ['Rizumu Ayaka', 'Ayaka Rizumu'],
              mapByEmailAliases: ['rizumu@ayaka.moe'],
            },
            {
              name: 'Nisekoi5',
              avatar: 'https://github.com/Nisekoi5.png',
              mapByNameAliases: ['Nisekoi5'],
            },
          ],
        },
      },
    }),
  ],
})
