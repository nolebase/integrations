import type { Plugin } from 'vue'

import type {
  Options,
} from './types'

import {
  LayoutMode,
} from './types'

import {
  InjectionKey,
  InlineHighlightModeStorageKey,
  LayoutSwitchModeStorageKey,
} from './constants'

import NolebaseEnhancedReadabilitiesMenu from './components/Menu.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './components/ScreenMenu.vue'
import LayoutSwitch from './components/LayoutSwitch.vue'
import ScreenLayoutSwitch from './components/ScreenLayoutSwitch.vue'
import InlineHighlight from './components/InlineHighlight.vue'
import ScreenInlineHighlight from './components/ScreenInlineHighlight.vue'

import 'virtual:uno.css'

export {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  LayoutSwitch,
  ScreenLayoutSwitch,
  LayoutSwitchModeStorageKey,
  InlineHighlight,
  ScreenInlineHighlight,
  InlineHighlightModeStorageKey,
  InjectionKey,
  LayoutMode,
}

const components = {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  NolebaseEnhancedReadabilitiesLayoutSwitch: LayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenLayoutSwitch: ScreenLayoutSwitch,
  NolebaseEnhancedReadabilitiesInlineHighlight: InlineHighlight,
  NolebaseEnhancedReadabilitiesScreenInlineHighlight: ScreenInlineHighlight,
}

export const NolebaseEnhancedReadabilitiesPlugin: Plugin = {
  install(app, options?: Options) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
