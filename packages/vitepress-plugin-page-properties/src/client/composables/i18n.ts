import { inject } from 'vue'
import { useData } from 'vitepress'

import { InjectionKey } from '../constants'
import { defaultEnLocale, defaultZhCNLocale } from '../locales'

function getValueByPropertyPaths(path: string, obj: Record<string, any>): string | undefined {
  const properties = path.split('.')
  let value = obj

  for (const property of properties) {
    value = value?.[property]
    if (!value)
      return undefined
  }

  if (typeof value === 'string')
    return value

  return String(value)
}

export function useI18n() {
  function getI18nProperty<Lang extends PropertyKey>(lang: Lang, key: string, options: {
    locales: Record<Lang, any>
    defaultLocales: Record<Lang, any>
  }): string {
    const { locales, defaultLocales } = options
    if (!locales && !defaultLocales)
      return key
    if (!lang)
      return key

    let languageLocale = locales[lang]
    if (!languageLocale) {
      languageLocale = defaultLocales[lang]
      if (!languageLocale)
        languageLocale = defaultEnLocale
    }

    const value = getValueByPropertyPaths(key, languageLocale)
    if (value)
      return value

    const defaultLanguageLocale = defaultLocales[lang]
    if (defaultLanguageLocale) {
      const defaultValue = getValueByPropertyPaths(key, defaultLanguageLocale)
      if (defaultValue)
        return defaultValue
    }

    const defaultEnLocaleValue = getValueByPropertyPaths(key, defaultEnLocale)
    if (defaultEnLocaleValue)
      return defaultEnLocaleValue

    return key
  }

  return {
    t(key: string, translateOptions?: { props: Record<string, any> }) {
      const options = inject(InjectionKey, {})
      const data = useData()
      const translatedValue = getI18nProperty(data.lang.value, key, {
        locales: options.locales || {},
        defaultLocales: {
          'zh-CN': defaultZhCNLocale,
          'zh': defaultZhCNLocale,
          'en-US': defaultEnLocale,
          'en': defaultEnLocale,
        },
      })
      if (!translatedValue)
        return key
      if (!translateOptions)
        return translatedValue

      const { props } = translateOptions
      if (!props)
        return translatedValue

      const properties = Object.keys(props)

      let translatedValueWithPropsReplaced = translatedValue
      properties.forEach((property) => {
        translatedValueWithPropsReplaced = translatedValueWithPropsReplaced.replace(`{{${property}}}`, props[property])
      })

      return translatedValueWithPropsReplaced
    },
  }
}
