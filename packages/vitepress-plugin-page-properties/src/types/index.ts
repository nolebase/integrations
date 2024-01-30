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

export type PagePropertiesData = Record<string, {
  wordCount: number
  readingTime: number
}>
