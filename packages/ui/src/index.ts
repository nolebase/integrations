import type { App } from 'vue'

import NuButton from './components/NuButton.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'
import NuLazyTeleportRiveCanvas from './components/NuLazyTeleportRiveCanvas.vue'

export {
  NuButton,
  NuVerticalTransition,
  NuLazyTeleportRiveCanvas,
}

export function install(app: App): void {
  app.component('NuButton', NuButton)
  // Animations
  app.component('NuLazyTeleportRiveCanvas', NuLazyTeleportRiveCanvas)
  app.component('NuVerticalTransition', NuVerticalTransition)
}
