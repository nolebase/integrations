import type { Plugin } from 'vue'

import type { Locale, Options } from './types'

import NolebaseRecentUpdates from './components/NolebaseRecentUpdates.vue'

import { InjectionKey } from './constants'

export {
  NolebaseRecentUpdates,
}

const components = {
  NolebaseRecentUpdates,
}

export const NolebaseIndexPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (typeof options !== 'undefined' && typeof options === 'object')
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}

export {
  InjectionKey,
}

export type {
  Locale,
  Options,
}
