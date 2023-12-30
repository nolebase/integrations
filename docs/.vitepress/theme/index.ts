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

import 'virtual:uno.css'

import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css'
import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

import './styles/vars.css'
import './styles/main.css'

import IntegrationCard from './components/IntegrationCard.vue'

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

    app.use(NolebaseInlineLinkPreviewPlugin)
    app.use(NolebaseGitChangelogPlugin)

    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      layoutSwitch: {
        defaultMode: NolebaseEnhancedReadabilitiesLayoutMode.SidebarWidthAdjustableOnly,
      },
      spotlight: {
        defaultToggle: true,
      },
    })

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
  },
}

export default Theme
