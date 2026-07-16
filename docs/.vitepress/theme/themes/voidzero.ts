import type { Theme } from 'vitepress'

import { defineThemeUnconfig } from '@nolebase/unconfig-vitepress'
import { NolebasePluginPreset } from '@nolebase/unconfig-vitepress/plugins'
import { NolebaseEnhancedReadabilitiesVoidZeroMenu } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { themeContextKey, VoidZeroTheme } from '@voidzero-dev/vitepress-theme'
import { inBrowser } from 'vitepress'
import { h } from 'vue'

import { enhanceSharedDocsApp } from './shared'

import 'virtual:uno.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'asciinema-player/dist/bundle/asciinema-player.css'
import '@nolebase/integrations/vitepress/client/theme/voidzero.css'
import '@voidzero-dev/vitepress-theme/src/styles/index.css'
import '../styles/vars.css'
import '../styles/main.css'

export default defineThemeUnconfig({
  extends: VoidZeroTheme,
  layout: {
    slots: {
      'layout-top': {
        node: [
          () => h(NolebaseEnhancedReadabilitiesVoidZeroMenu),
        ],
      },
    },
  },
  enhanceApp(ctx) {
    if (inBrowser)
      document.documentElement.dataset.nolebaseVitepressTheme = 'voidzero'

    ctx.app.provide(themeContextKey, {
      footerBg: '/logo-dark.png',
      logoAlt: 'Nolebase Integrations',
      logoDark: '/logo-dark.png',
      logoLight: '/logo-light.png',
      monoIcon: '/logo.svg',
    })

    VoidZeroTheme.enhanceApp?.(ctx)
    enhanceSharedDocsApp(ctx)
  },
  pluginPresets: [
    NolebasePluginPreset({
      theme: 'voidzero',
    }),
  ],
}) satisfies Theme
