import { computed, inject } from 'vue'
import { useData } from 'vitepress'

import { InjectionKey } from '../constants'
import { defaultEnLocale, defaultLocales } from '../locales'

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

function getTranslationValueByI18nPropertyKey<Lang extends PropertyKey>(
  lang: Lang,
  key: string,
  options: {
    locales: Record<Lang, any>
    defaultLocales: Record<Lang, any>
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

export function useI18n() {
  const options = inject(InjectionKey, { locales: {} })

  const { lang } = useData()
  const language = computed(() => lang.value || 'en')

  return {
    t(key: string, translateOptions?: { props: Record<string, any> }) {
      const translatedValue = computed(() => {
        return getTranslationValueByI18nPropertyKey(language.value, key, {
          locales: options.locales || {},
          defaultLocales,
        })
      })

      if (!translatedValue.value)
        return key
      if (!translateOptions || !translateOptions.props)
        return translatedValue.value

      return computed(() => {
        let result = translatedValue.value

        Object.entries(translateOptions.props).forEach(([property, value]) => {
          result = result.replace(new RegExp(`{{${property}}}`, 'g'), String(value))
        })

        return result
      }).value
    },
  }
}
