import type { Plugin } from 'vue'

import type {
  Options,
} from './types'

import {
  InjectionKey,
  LayoutMode,
  LayoutSwitchModeStorageKey,
  SpotlightToggledStorageKey,
} from './constants'

import NolebaseEnhancedReadabilitiesMenu from './components/Menu.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './components/ScreenMenu.vue'

import LayoutSwitch from './components/LayoutSwitch.vue'
import LayoutSwitchContentLayoutMaxWidthSlider from './components/LayoutSwitchContentLayoutMaxWidthSlider.vue'
import LayoutSwitchPageLayoutMaxWidthSlider from './components/LayoutSwitchPageLayoutMaxWidthSlider.vue'
import ScreenLayoutSwitch from './components/ScreenLayoutSwitch.vue'

import Spotlight from './components/Spotlight.vue'
import ScreenSpotlight from './components/ScreenSpotlight.vue'
import SpotlightStyles from './components/SpotlightStyles.vue'

import 'virtual:uno.css'
import './styles/main.less'

export type {
  Options,
}

export {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  LayoutSwitch,
  LayoutSwitchContentLayoutMaxWidthSlider,
  LayoutSwitchPageLayoutMaxWidthSlider,
  ScreenLayoutSwitch,
  LayoutSwitchModeStorageKey,
  Spotlight,
  SpotlightStyles,
  ScreenSpotlight,
  SpotlightToggledStorageKey,
  InjectionKey,
  LayoutMode,
}

const components = {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  NolebaseEnhancedReadabilitiesLayoutSwitch: LayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenLayoutSwitch: ScreenLayoutSwitch,
  NolebaseEnhancedReadabilitiesSpotlight: Spotlight,
  NolebaseEnhancedReadabilitiesSpotlightStyles: SpotlightStyles,
  NolebaseEnhancedReadabilitiesScreenSpotlight: ScreenSpotlight,
}

export const NolebaseEnhancedReadabilitiesPlugin: Plugin = {
  install(app, options?: Options) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
