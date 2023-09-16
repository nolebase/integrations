import type { Plugin } from 'vue'
import NolebaseEnhancedReadabilitiesMenu from './components/Menu.vue'
import NolebaseEnhancedReadabilitiesHighlightParagraph from './components/HighlightParagraph.vue'
import NolebaseEnhancedReadabilitiesLayoutSwitch from './components/LayoutSwitch.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './components/ScreenMenu.vue'
import 'virtual:uno.css'

export interface Props {
  name: string
}

const components = {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesHighlightParagraph,
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
  NolebaseEnhancedReadabilitiesHighlightParagraph,
  NolebaseEnhancedReadabilitiesLayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenMenu,
}
