import type { App } from 'vue'

import NuButton from './components/NuButton.vue'
import NuLazyDOMRiveCanvas from './components/NuLazyDOMRiveCanvas.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'

export {
  NuButton,
  NuLazyDOMRiveCanvas,
  NuVerticalTransition,
}

export function install(app: App): void {
  app.component('NuButton', NuButton)

  // Animations
  app.component('NuLazyDOMRiveCanvas', NuLazyDOMRiveCanvas)
  app.component('NuVerticalTransition', NuVerticalTransition)
}
