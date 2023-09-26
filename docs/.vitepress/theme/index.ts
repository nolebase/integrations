import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import type { Options as NolebaseEnhancedReadabilitiesOptions } from '@nolebase/vitepress-plugin-enhanced-readabilities'

import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu, NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  CommentAnnotation,
} from '@nolebase/sidecar-annotations'

import 'virtual:uno.css'

import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css'
import '@nolebase/sidecar-annotations/dist/style.css'

import './styles/vars.css'
import './styles/main.css'

import IntegrationCard from './components/IntegrationCard.vue'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
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
    app.component('CommentAnnotation', CommentAnnotation)
    app.use(NolebaseInlineLinkPreviewPlugin)
    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.FullWidth,
      },
      spotlight: {
        defaultToggle: true,
      },
    } as NolebaseEnhancedReadabilitiesOptions)
  },
}

export default Theme
