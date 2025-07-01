import type { InjectionKey } from 'vue'

import { useData } from 'vitepress'
import { computed, inject } from 'vue'

function getValueByPropertyPaths<T extends PropertyKey>(path: T, obj?: Record<string, any>): string | undefined {
  if (!obj)
    return undefined

  const properties = String(path).split('.')
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

function getTranslationValueByI18nPropertyKey<Lang extends PropertyKey>(
  lang: Lang,
  key: string,
  options: {
    locales: Record<Lang, any>
    defaultLocales: Record<Lang, any>
    defaultEnLocale?: Record<string, any>
  },
): string {
  const { locales, defaultLocales } = options

  if (!locales && !defaultLocales)
    return key
  if (!lang)
    return key

  let languageLocale = locales[lang]
  if (!languageLocale) {
    languageLocale = defaultLocales[lang]
    if (!languageLocale)
      languageLocale = options.defaultEnLocale
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

  const defaultEnLocaleValue = getValueByPropertyPaths(key, options.defaultEnLocale)
  if (defaultEnLocaleValue)
    return defaultEnLocaleValue

  return key
}

export interface LocalesOptions { locales: Record<string, Record<string, any>> }

export function createI18n(injectionKey: InjectionKey<LocalesOptions>, defaultLocales: Record<string, Record<string, any>>, defaultEnLocale?: Record<string, any>) {
  return () => {
    const options = inject(injectionKey, { locales: {} })

    const { lang } = useData()
    const language = computed(() => lang.value || 'en')

    return {
      t(key: string, translateOptions?: { props?: Record<string, any>, omitEmpty?: boolean }) {
        const translatedValue = computed(() => {
          return getTranslationValueByI18nPropertyKey(language.value, key, {
            locales: options.locales || {},
            defaultLocales,
            defaultEnLocale,
          })
        })

        if (!translatedValue.value)
          return translateOptions?.omitEmpty ? '' : key
        if (translateOptions?.omitEmpty && translatedValue.value === key)
          return ''
        if (!translateOptions || !translateOptions.props)
          return translatedValue.value

        return computed(() => {
          let result = translatedValue.value

          Object.entries(translateOptions.props || {}).forEach(([property, value]) => {
            result = result.replace(new RegExp(`{{${property}}}`, 'g'), String(value))
          })

          return result
        }).value
      },
    }
  }
}
