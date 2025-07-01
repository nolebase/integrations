import type { Plugin } from 'vue'

import type { Author, Changelog, Commit, Contributor } from '../types'
import type { Locale, Options } from './types'

import NolebaseGitChangelog from './components/Changelog.vue'
import NolebaseGitContributors from './components/Contributors.vue'

import { InjectionKey } from './constants'

export { default as NolebaseGitChangelog } from './components/Changelog.vue'
export { default as NolebaseGitContributors } from './components/Contributors.vue'

const components = {
  NolebaseGitChangelog,
  NolebaseGitContributors,
}

export * from './composables'

export const NolebaseGitChangelogPlugin: Plugin<Options[]> = {
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
  Author,
  Changelog,
  Commit,
  Contributor,
  Locale,
  Options,
}
