import type { Plugin } from 'vue'

import type { Locale, Options, PlainProperty, Property, PropertyType, TagsProperty } from './types'
import { InjectionKey } from './constants'
import NolebasePageProperties from './components/PageProperties.vue'
import NolebasePagePropertiesEditor from './components/PagePropertiesEditor.vue'

import 'virtual:uno.css'

const components = {
  NolebasePageProperties,
  NolebasePagePropertiesEditor,
}

export function NolebasePagePropertiesPlugin<P extends object>(): Plugin<Options<P>[]> {
  return {
    install(app, options) {
      if (options)
        app.provide(InjectionKey, options)

      for (const key of Object.keys(components))
        app.component(key, components[key as keyof typeof components])
    },
  }
}

export {
  NolebasePageProperties,
  NolebasePagePropertiesEditor,
  InjectionKey,
}

export type {
  Options,
  Locale,
  PlainProperty,
  Property,
  TagsProperty,
  PropertyType,
}
