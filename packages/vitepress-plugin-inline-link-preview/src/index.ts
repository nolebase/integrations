import type { Plugin } from 'vue'

import { InjectionKey } from './constants'
import type { Options } from './types'

import InlineLinkPreview from './components/InlineLinkPreview.vue'

import 'virtual:uno.css'

export {
  InlineLinkPreview as NolebaseInlineLinkPreview,
  Options,
  InjectionKey,
}

const components = {
  VPNolebaseInlinePreviewLink: InlineLinkPreview,
}

export const NolebaseInlineLinkPreviewPlugin: Plugin = {
  install(app, options?: Options) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
