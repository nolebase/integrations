import type { Theme } from 'vitepress'

import { defineThemeUnconfig } from '@nolebase/unconfig-vitepress'
import { NolebasePluginPreset } from '@nolebase/unconfig-vitepress/plugins'
import { themeContextKey, VoidZeroTheme } from '@voidzero-dev/vitepress-theme'
import { withBase } from 'vitepress'

import { enhanceSharedDocsApp } from './shared'

// Must stay before `virtual:uno.css`, it pins the cascade layer order UnoCSS output relies on.
import '../styles/voidzero-layers.css'
import 'virtual:uno.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'asciinema-player/dist/bundle/asciinema-player.css'
import '@nolebase/integrations/vitepress/client/theme/voidzero.css'
import '@voidzero-dev/vitepress-theme/src/styles/index.css'
import '../styles/vars.css'
import '../styles/main.css'

export default defineThemeUnconfig({
  extends: VoidZeroTheme,
  enhanceApp(ctx) {
    // VoidZero renders these paths as-is, so prefix them with the site base (`/themes/voidzero/`).
    ctx.app.provide(themeContextKey, {
      footerBg: withBase('/logo-dark.png'),
      logoAlt: 'Nolebase Integrations',
      logoDark: withBase('/logo-dark.png'),
      logoLight: withBase('/logo-light.png'),
      monoIcon: withBase('/logo.svg'),
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
