import type { Plugin } from 'vue'

import { InjectionKey } from './constants'
import type { Options } from './types'

import LinkPreviewPopup from './components/LinkPreviewPopup.vue'

import 'virtual:uno.css'

export const NolebaseInlineLinkPreview: Plugin = {
  install(app, options?: Options) {
    if (options)
      app.provide(InjectionKey, options)

    app.component('VPNolebaseInlinePreviewLink', LinkPreviewPopup)
  },
}
