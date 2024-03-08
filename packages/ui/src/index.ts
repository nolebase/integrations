import type { App } from 'vue'

import NuButton from './components/NuButton.vue'
import NuLazyDOMRiveCanvas from './components/NuLazyDOMRiveCanvas.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'

import 'virtual:uno.css'

export { default as NuButton } from './components/NuButton.vue'
export { default as NuLazyDOMRiveCanvas } from './components/NuLazyDOMRiveCanvas.vue'
export { default as NuVerticalTransition } from './components/NuVerticalTransition.vue'

export function install(app: App): void {
  app.component('NuButton', NuButton)

  // Animations
  app.component('NuLazyDOMRiveCanvas', NuLazyDOMRiveCanvas)
  app.component('NuVerticalTransition', NuVerticalTransition)
}
