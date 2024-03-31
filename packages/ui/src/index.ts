import type { App } from 'vue'

import NuButton from './components/NuButton.vue'
import NuInputSlider from './components/NuInputSlider.vue'
import NuInputHorizontalRadioGroup from './components/NuInputHorizontalRadioGroup/index.vue'
import NuVerticalTransition from './components/NuVerticalTransition.vue'
import NuLazyTeleportRiveCanvas from './components/NuLazyTeleportRiveCanvas.vue'

import { createI18n } from './composables/i18n'

export {
  NuButton,
  NuInputSlider,
  NuInputHorizontalRadioGroup,
  NuVerticalTransition,
  NuLazyTeleportRiveCanvas,
  createI18n,
}

export function install(app: App): void {
  app.component('NuButton', NuButton)
  app.component('NuInputSlider', NuInputSlider)
  app.component('NuInputHorizontalRadioGroup', NuInputHorizontalRadioGroup)
  // Animations
  app.component('NuLazyTeleportRiveCanvas', NuLazyTeleportRiveCanvas)
  app.component('NuVerticalTransition', NuVerticalTransition)
}
