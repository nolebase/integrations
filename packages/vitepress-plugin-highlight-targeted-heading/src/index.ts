import type { Plugin } from 'vue'

import NolebaseHighlightTargetedHeading from './components/HighlightTargetedHeading.vue'

import 'virtual:uno.css'

export {
  NolebaseHighlightTargetedHeading,
}

const components = {
  NolebaseHighlightTargetedHeading,
}

export const NolebaseNolebaseHighlightTargetedHeadingPlugin: Plugin = {
  install(app) {
    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
