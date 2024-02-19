import type { Plugin } from 'vue'

import type {
  DatetimeProperty,
  DynamicProperty,
  DynamicPropertyType,
  DynamicReadingTimeProperty,
  DynamicWordsCountProperty,
  LinkProperty,
  Locale,
  Options,
  PlainProperty,
  ProgressProperty,
  Property,
  PropertyType,
  TagsProperty,
} from './types'

import { InjectionKey } from './constants'
import NolebasePageProperties from './components/PageProperties.vue'
import NolebasePagePropertiesEditor from './components/PagePropertiesEditor.vue'

import 'virtual:uno.css'

const components = {
  NolebasePageProperties,
  NolebasePagePropertiesEditor,
}

export function NolebasePagePropertiesPlugin<P extends object = any>(): Plugin<Options<P>[]> {
  return {
    install(app, options?) {
      if (typeof options !== 'undefined' && typeof options === 'object')
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
  Locale,
  Options,
  Property,
  PropertyType,
  PlainProperty,
  TagsProperty,
  DatetimeProperty,
  LinkProperty,
  ProgressProperty,
  DynamicProperty,
  DynamicPropertyType,
  DynamicReadingTimeProperty,
  DynamicWordsCountProperty,
}
