import type { App } from 'vue'

import NuButton from './components/NuButton.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'

export {
  NuButton,
  NuVerticalTransition,
}

export function install(app: App): void {
  app.component('NuButton', NuButton)
  // Animations
  app.component('NuVerticalTransition', NuVerticalTransition)
}
