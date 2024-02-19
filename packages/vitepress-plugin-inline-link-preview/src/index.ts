import type { Plugin } from 'vue'

import { InjectionKey } from './constants'
import type { Options } from './types'

import InlineLinkPreview from './components/InlineLinkPreview.vue'

import 'virtual:uno.css'

export type {
  Options,
}

export {
  InlineLinkPreview as NolebaseInlineLinkPreview,
  InjectionKey,
}

const components = {
  VPNolebaseInlineLinkPreview: InlineLinkPreview,
}

export const NolebaseInlineLinkPreviewPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
