interface TagsProperty<K extends PropertyKey> {
  type: 'tags'
  key: K
  title: string
  omitEmpty?: boolean
}

interface PlainProperty<K extends PropertyKey> {
  type: 'plain'
  key: K
  title: string
  omitEmpty?: boolean
}

interface DatetimeProperty<K extends PropertyKey> {
  type: 'datetime'
  key: K
  title: string
  formatAsFrom?: boolean
  dateFnsLocaleName?: import('./types').LocaleName
  format?: string
  omitEmpty?: boolean
}

interface ProgressProperty<K extends PropertyKey> {
  type: 'progress'
  key: K
  title: string
  omitEmpty?: boolean
}

interface LinkProperty<K extends PropertyKey> {
  type: 'link'
  key: K
  title: string
  omitEmpty?: boolean
}

interface DynamicProperty<K extends PropertyKey> {
  type: 'dynamic'
  key: K | string
  title: string
  options:
    | DynamicWordsCountProperty
    | DynamicReadingTimeProperty
}

interface DynamicWordsCountProperty {
  type: 'wordsCount'
}

interface DynamicReadingTimeProperty {
  type: 'readingTime'
  dateFnsLocaleName?: import('./types').LocaleName
}

type Property<K extends PropertyKey>
  = | TagsProperty<K>
    | PlainProperty<K>
    | DatetimeProperty<K>
    | ProgressProperty<K>
    | LinkProperty<K>
    | DynamicProperty<K>

type PropertyType = Property<PropertyKey>['type']
type DynamicPropertyType = DynamicProperty<PropertyKey>['options']['type']

declare module 'virtual:nolebase-page-properties' {
  const pagePropertiesData: Record<string, {
    wordsCount: number
    readingTime: number
  }>

  export default pagePropertiesData
}
