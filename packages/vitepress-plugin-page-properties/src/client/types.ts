export interface Locale {
}

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
}

export interface ProgressProperty<K extends PropertyKey> {
  type: 'progress'
  key: K
  title: string
}

export type Property<K extends PropertyKey> = TagsProperty<K> | PlainProperty<K> | DatetimeProperty<K> | ProgressProperty<K>
export type PropertyType = Property<PropertyKey>['type']

export interface Options<P extends object = any> {
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
  properties?: Property<keyof P>[]
}
