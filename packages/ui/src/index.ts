import type { App } from 'vue'
import 'virtual:uno.css'

import NuButton from './components/NuButton.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'

export { default as NuButton } from './components/NuButton.vue'
export { default as NuVerticalTransition } from './components/NuVerticalTransition.vue'

export function install(app: App): void {
  app.component('NuButton', NuButton)
  app.component('NuVerticalTransition', NuVerticalTransition)
}
