import type { Plugin } from 'vue'

import type { Changelog, Commit } from '../types'
import type { Locale, Options } from './types'
import { InjectionKey } from './constants'
import NolebaseGitChangelog from './components/Changelog.vue'
import NolebaseGitContributors from './components/Contributors.vue'

import 'virtual:uno.css'

const components = {
  NolebaseGitChangelog,
  NolebaseGitContributors,
}

export const NolebaseGitChangelogPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (options)
      app.provide(InjectionKey, options)

    for (const key of Object.keys(components))
      app.component(key, components[key as keyof typeof components])
  },
}

export {
  NolebaseGitChangelog,
  NolebaseGitContributors,
  InjectionKey,
}

export type {
  Commit,
  Changelog,
  Options,
  Locale,
}
