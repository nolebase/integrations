interface TagsProperty<K extends PropertyKey> {
  type: 'tags'
  key: K
  title: string
}

interface PlainProperty<K extends PropertyKey> {
  type: 'plain'
  key: K
  title: string
}

interface DatetimeProperty<K extends PropertyKey> {
  type: 'datetime'
  key: K
  title: string
  formatAsFrom?: boolean
  dateFnsLocaleName?: string
  format?: string
}

interface ProgressProperty<K extends PropertyKey> {
  type: 'progress'
  key: K
  title: string
}

interface LinkProperty<K extends PropertyKey> {
  type: 'link'
  key: K
  title: string
}

interface DynamicProperty<K extends PropertyKey> {
  type: 'dynamic'
  key: K | string
  title: string
  options:
    DynamicWordsCountProperty |
    DynamicReadingTimeProperty
}

interface DynamicWordsCountProperty {
  type: 'wordsCount'
}

interface DynamicReadingTimeProperty {
  type: 'readingTime'
  dateFnsLocaleName?: string
}

type Property<K extends PropertyKey> =
  TagsProperty<K> |
  PlainProperty<K> |
  DatetimeProperty<K> |
  ProgressProperty<K> |
  LinkProperty<K> |
  DynamicProperty<K>

type PropertyType = Property<PropertyKey>['type']
type DynamicPropertyType = DynamicProperty<PropertyKey>['options']['type']

declare module 'virtual:nolebase-page-properties' {
  const pagePropertiesData: Record<string, {
    wordsCount: number
    readingTime: number
  }>

  export default pagePropertiesData
}
