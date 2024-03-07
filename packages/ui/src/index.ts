import type { App } from 'vue'
import 'virtual:uno.css'

import NuButton from './components/NuButton.vue'

export { default as NuButton } from './components/NuButton.vue'

export function install(app: App): void {
  app.component('NuButton', NuButton)
}
