import { NuLazyTeleportRiveCanvas } from '@nolebase/ui-rive-canvas'
import { defineThemeUnconfig } from '@nolebase/unconfig-vitepress'
import { NolebasePluginPreset } from '@nolebase/unconfig-vitepress/plugins'
import { h } from 'vue'

import NavHeader from '../components/NavHeader.vue'
import VPHeroImageLogo from '../components/VPHeroImageLogo.vue'

import { enhanceSharedDocsApp } from './shared'

import 'virtual:uno.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'asciinema-player/dist/bundle/asciinema-player.css'
import '@nolebase/integrations/vitepress/client/style.css'
import '../styles/vars.css'
import '../styles/main.css'

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
  enhanceApp: enhanceSharedDocsApp,
  pluginPresets: [
    NolebasePluginPreset({
      theme: 'vitepress',
    }),
  ],
})
