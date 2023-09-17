import type { Plugin } from 'vue'

import { injectionKey as NolebaseEnhancedReadabilitiesInjectionKey } from './types'
import type { EnhancedReadabilitiesOptions as NolebaseEnhancedReadabilitiesOptions } from './types'

import NolebaseEnhancedReadabilitiesMenu from './components/Menu.vue'
import NolebaseEnhancedReadabilitiesInlineHighlight from './components/InlineHighlight.vue'
import NolebaseEnhancedReadabilitiesLayoutSwitch from './components/LayoutSwitch.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './components/ScreenMenu.vue'

import 'virtual:uno.css'

export interface Props {
  name: string
}

const components = {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesInlineHighlight,
  NolebaseEnhancedReadabilitiesLayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenMenu,
}

export const LayoutSwitchPlugin: Plugin = {
  install(app) {
    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}

export {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesInlineHighlight,
  NolebaseEnhancedReadabilitiesLayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenMenu,
  NolebaseEnhancedReadabilitiesInjectionKey,
  NolebaseEnhancedReadabilitiesOptions,
}
