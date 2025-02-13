import type {
  DatetimeProperty,
  DynamicProperty,
  LinkProperty,
  PlainProperty,
  ProgressProperty,
  Property,
  TagsProperty,
} from '../types'

export function isTagsProperty<K extends PropertyKey = any>(value?: any, property?: Property<K> | null): property is TagsProperty<K> | null {
  return value && typeof value === 'object' && property && property.type && property.type === 'tags'
}

export function isPlainProperty<K extends PropertyKey = any>(_?: any, property?: Property<K> | null): property is PlainProperty<K> | null {
  if (property && property.type && property.type === 'plain')
    return true

  return false
}

export function isDatetimeProperty<K extends PropertyKey = any>(value?: any, property?: Property<K> | null): property is DatetimeProperty<K> | null {
  try {
    const date = new Date(value)
    if (date.toString() === 'Invalid Date')
      return false
  }
  catch {
    return false
  }

  if (property && property.type && property.type === 'datetime')
    return true

  return false
}

export function isProgressProperty<K extends PropertyKey = any>(value?: any, property?: Property<K> | null): property is ProgressProperty<K> | null {
  const parsedValue = Number.parseFloat(value)
  if (Number.isNaN(parsedValue))
    return false

  if (property && property.type && property.type === 'progress')
    return true

  return false
}

export function isLinkProperty<K extends PropertyKey = any>(_?: any, property?: Property<K> | null): property is LinkProperty<K> | null {
  if (property && property.type && property.type === 'link')
    return true

  return false
}

export function isDynamicWordsCountProperty<K extends PropertyKey = any>(_?: any, property?: Property<K> | null): property is DynamicProperty<K> | null {
  if (property && property.type && property.type === 'dynamic' && property.options && property.options.type === 'wordsCount')
    return true

  return false
}

export function isDynamicReadingTimeProperty<K extends PropertyKey = any>(_?: any, property?: Property<K> | null): property is DynamicProperty<K> | null {
  if (property && property.type && property.type === 'dynamic' && property.options && property.options.type === 'readingTime')
    return true

  return false
}
