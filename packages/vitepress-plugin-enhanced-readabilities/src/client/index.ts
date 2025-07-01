import type { Plugin } from 'vue'

import type {
  Locale,
  Options,
} from './types'

import LayoutSwitch from './components/LayoutSwitch.vue'
import LayoutSwitchContentLayoutMaxWidthSlider from './components/LayoutSwitchContentLayoutMaxWidthSlider.vue'
import LayoutSwitchPageLayoutMaxWidthSlider from './components/LayoutSwitchPageLayoutMaxWidthSlider.vue'
import NolebaseEnhancedReadabilitiesMenu from './components/Menu.vue'
import ScreenLayoutSwitch from './components/ScreenLayoutSwitch.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './components/ScreenMenu.vue'
import ScreenSpotlight from './components/ScreenSpotlight.vue'
import Spotlight from './components/Spotlight.vue'
import SpotlightStyles from './components/SpotlightStyles.vue'

import {
  InjectionKey,
  LayoutMode,
  LayoutSwitchModeStorageKey,
  SpotlightStyle,
  SpotlightToggledStorageKey,
} from './constants'

export type {
  Locale,
  Options,
}

export {
  InjectionKey,
  LayoutMode,
  LayoutSwitch,
  LayoutSwitchContentLayoutMaxWidthSlider,
  LayoutSwitchModeStorageKey,
  LayoutSwitchPageLayoutMaxWidthSlider,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  ScreenLayoutSwitch,
  ScreenSpotlight,
  Spotlight,
  SpotlightStyle,
  SpotlightStyles,
  SpotlightToggledStorageKey,
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

export const NolebaseEnhancedReadabilitiesPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (typeof options !== 'undefined' && typeof options === 'object')
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
