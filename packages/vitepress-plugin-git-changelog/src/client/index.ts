import type { Plugin } from 'vue'

import type { Changelog, Commit } from '../types'
import type { Locale, Options } from './types'
import { InjectionKey } from './constants'
import NolebaseGitChangelog from './components/Changelog.vue'

import 'virtual:uno.css'

const components = {
  NolebaseGitChangelog,
}

export const NolebaseGitChangelogPlugin: Plugin = {
  install(app, options?: Options) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}

export {
  NolebaseGitChangelog,
  InjectionKey,
}

export type {
  Commit,
  Changelog,
  Options,
  Locale,
}
