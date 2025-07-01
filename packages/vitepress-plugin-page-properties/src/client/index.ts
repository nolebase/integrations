import type { Plugin } from 'vue'

import type {
  DatetimeProperty,
  DynamicProperty,
  DynamicPropertyType,
  DynamicReadingTimeProperty,
  DynamicWordsCountProperty,
  LinkProperty,
  Locale,
  LocaleName,
  Options,
  PlainProperty,
  ProgressProperty,
  Property,
  PropertyType,
  TagsProperty,
} from './types'

import NolebasePageProperties from './components/PageProperties.vue'
import NolebasePagePropertiesEditor from './components/PagePropertiesEditor.vue'

import { InjectionKey } from './constants'

const components = {
  NolebasePageProperties,
  NolebasePagePropertiesEditor,
}

export function NolebasePagePropertiesPlugin<P extends object>(): Plugin<Options<P>[]> {
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
  InjectionKey,
  NolebasePageProperties,
  NolebasePagePropertiesEditor,
}

export type {
  DatetimeProperty,
  DynamicProperty,
  DynamicPropertyType,
  DynamicReadingTimeProperty,
  DynamicWordsCountProperty,
  LinkProperty,
  Locale,
  LocaleName,
  Options,
  PlainProperty,
  ProgressProperty,
  Property,
  PropertyType,
  TagsProperty,
}
