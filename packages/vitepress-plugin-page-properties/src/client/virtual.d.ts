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
    DynamicWordCountProperty |
    DynamicReadingTimeProperty |
    DynamicFormulaProperty
}

interface DynamicWordCountProperty {
  type: 'wordCount'
}

interface DynamicReadingTimeProperty {
  type: 'readingTime'
}

interface DynamicFormulaProperty {
  type: 'formula'
  formula: (pageData: any) => string | Promise<string>
}

type Property<K extends PropertyKey> =
  TagsProperty<K> |
  PlainProperty<K> |
  DatetimeProperty<K> |
  ProgressProperty<K> |
  LinkProperty<K> |
  DynamicProperty<K>

type PropertyType = Property<PropertyKey>['type']

declare module 'virtual:nolebase-page-properties' {
  const pagePropertiesData: Record<string, {
    wordsCount: number
    readingTime: number
  }>

  export default pagePropertiesData
}
