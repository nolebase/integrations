import type { Plugin } from 'vue'

import NolebaseRecentUpdates from './components/NolebaseRecentUpdates.vue'

export {
  NolebaseRecentUpdates,
}

const components = {
  NolebaseRecentUpdates,
}

export const NolebaseIndexPlugin: Plugin<[]> = {
  install(app) {
  // install(app, options?) {
    // if (typeof options !== 'undefined' && typeof options === 'object')
    //   app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}
