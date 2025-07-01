import type * as DateFnsLocales from 'date-fns/locale'

export type LocaleName = keyof typeof DateFnsLocales

export interface TagsProperty<K extends PropertyKey> {
  type: 'tags'
  key: K
  title: string
  omitEmpty?: boolean
}

export interface PlainProperty<K extends PropertyKey> {
  type: 'plain'
  key: K
  title: string
  omitEmpty?: boolean
}

export interface DatetimeProperty<K extends PropertyKey> {
  type: 'datetime'
  key: K
  title: string
  formatAsFrom?: boolean
  dateFnsLocaleName?: LocaleName
  format?: string
  omitEmpty?: boolean
}

export interface ProgressProperty<K extends PropertyKey> {
  type: 'progress'
  key: K
  title: string
  omitEmpty?: boolean
}

export interface LinkProperty<K extends PropertyKey> {
  type: 'link'
  key: K
  title: string
  omitEmpty?: boolean
}

export interface DynamicProperty<K extends PropertyKey> {
  type: 'dynamic'
  key: K | string
  title: string
  options:
    DynamicWordsCountProperty
    | DynamicReadingTimeProperty
}

export interface DynamicWordsCountProperty {
  type: 'wordsCount'
}

export interface DynamicReadingTimeProperty {
  type: 'readingTime'
  dateFnsLocaleName?: LocaleName
}

export type Property<K extends PropertyKey>
  = TagsProperty<K>
    | PlainProperty<K>
    | DatetimeProperty<K>
    | ProgressProperty<K>
    | LinkProperty<K>
    | DynamicProperty<K>

export type PropertyType = Property<PropertyKey>['type']
export type DynamicPropertyType = DynamicProperty<PropertyKey>['options']['type']

export interface Locale extends Record<string, any> {
  pageProperties?: {
    wordsCount?: string
  }
}

export interface Options<P extends object> {
  /**
   * Internationalization configuration
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * @default undefined
   * @example
   * ```ts
   * {
   *  locales: {
   *    'en': {
   *      ...
   *    },
   *    'zh-CN': {
   *      ...
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  properties?: Record<string, Property<keyof P>[]>
}
