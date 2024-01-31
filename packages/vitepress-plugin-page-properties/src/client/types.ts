export interface TagsProperty<K extends PropertyKey> {
  type: 'tags'
  key: K
  title: string
}

export interface PlainProperty<K extends PropertyKey> {
  type: 'plain'
  key: K
  title: string
}

export interface DatetimeProperty<K extends PropertyKey> {
  type: 'datetime'
  key: K
  title: string
  formatAsFrom?: boolean
  dateFnsLocaleName?: string
  format?: string
}

export interface ProgressProperty<K extends PropertyKey> {
  type: 'progress'
  key: K
  title: string
}

export interface LinkProperty<K extends PropertyKey> {
  type: 'link'
  key: K
  title: string
}

export interface DynamicProperty<K extends PropertyKey> {
  type: 'dynamic'
  key: K | string
  title: string
  options:
    DynamicWordCountProperty |
    DynamicReadingTimeProperty |
    DynamicFormulaProperty
}

export interface DynamicWordCountProperty {
  type: 'wordCount'
}

export interface DynamicReadingTimeProperty {
  type: 'readingTime'
}

export interface DynamicFormulaProperty {
  type: 'formula'
  formula: (pageData: any) => string | Promise<string>
}

export type Property<K extends PropertyKey> =
  TagsProperty<K> |
  PlainProperty<K> |
  DatetimeProperty<K> |
  ProgressProperty<K> |
  LinkProperty<K> |
  DynamicProperty<K>

export type PropertyType = Property<PropertyKey>['type']

export interface Locale {
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
