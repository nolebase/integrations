import type {
  DatetimeProperty,
  DynamicCustomProperty,
  DynamicProperty,
  DynamicReadingTimeProperty,
  DynamicWordsCountProperty,
  LinkProperty,
  PlainProperty,
  ProgressProperty,
  Property,
  TagsProperty,
} from '../types'

export function isTagsProperty(value?: any, property?: Property<PropertyKey> | null): property is TagsProperty<PropertyKey> | null {
  return value && typeof value === 'object' && property && property.type && property.type === 'tags'
}

export function isPlainProperty(_?: any, property?: Property<PropertyKey> | null): property is PlainProperty<PropertyKey> | null {
  if (property && property.type && property.type === 'plain')
    return true

  return false
}

export function isDatetimeProperty(value?: any, property?: Property<PropertyKey> | null): property is DatetimeProperty<PropertyKey> | null {
  try {
    const date = new Date(value)
    if (date.toString() === 'Invalid Date')
      return false
  }
  catch (e) {
    return false
  }

  if (property && property.type && property.type === 'datetime')
    return true

  return false
}

export function isProgressProperty(value?: any, property?: Property<PropertyKey> | null): property is ProgressProperty<PropertyKey> | null {
  const parsedValue = Number.parseFloat(value)
  if (Number.isNaN(parsedValue))
    return false

  if (property && property.type && property.type === 'progress')
    return true

  return false
}

export function isLinkProperty(_?: any, property?: Property<PropertyKey> | null): property is LinkProperty<PropertyKey> | null {
  if (property && property.type && property.type === 'link')
    return true

  return false
}

export function isDynamicWordsCountProperty(_?: any, property?: Property<PropertyKey> | null): property is DynamicProperty<PropertyKey, DynamicWordsCountProperty> | null {
  if (property && property.type && property.type === 'dynamic' && property.options && property.options.type === 'wordsCount')
    return true

  return false
}

export function isDynamicReadingTimeProperty(_?: any, property?: Property<PropertyKey> | null): property is DynamicProperty<PropertyKey, DynamicReadingTimeProperty> | null {
  if (property && property.type && property.type === 'dynamic' && property.options && property.options.type === 'readingTime')
    return true

  return false
}

export function isDynamicCustomProperty(_?: any, property?: Property<PropertyKey> | null): property is DynamicProperty<PropertyKey, DynamicCustomProperty> | null {
  if (property && property.type && property.type === 'dynamic' && property.options && property.options.type === 'custom')
    return true

  return false
}
