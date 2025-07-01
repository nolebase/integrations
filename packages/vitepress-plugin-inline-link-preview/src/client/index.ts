import type { Plugin } from 'vue'

import type { Options } from './types'

import InlineLinkPreview from './components/InlineLinkPreview.vue'
import PopupIframe from './components/PopupIframe.vue'

import { InjectionKey } from './constants'

export type {
  Options,
}

export {
  InjectionKey,
  InlineLinkPreview as NolebaseInlineLinkPreview,
  PopupIframe,
}

const components = {
  VPNolebaseInlineLinkPreview: InlineLinkPreview,
}

export const NolebaseInlineLinkPreviewPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (typeof options !== 'undefined' && typeof options === 'object')
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
