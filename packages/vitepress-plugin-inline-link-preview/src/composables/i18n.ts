import { computed, inject } from 'vue'
import { useData } from 'vitepress'
import type { Options } from '../types'
import { InjectionKey } from '../constants'
import { defaultEnLocale, defaultZhCNLocale } from '../locales'

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

    const properties = key.split('.')
    let value = languageLocale

    for (const property of properties) {
      value = value?.[property]
      if (!value)
        return key
    }

    return value
  }

  return {
    t(key: string, ...translateOptions: any) {
      const options = inject<Options>(InjectionKey, {})
      const data = useData()

      const i18nProperty = computed(() => {
        const optionValue = getI18nProperty(data.lang.value, key, {
          locales: options.locales || {},
          defaultLocales: {
            'zh-CN': defaultZhCNLocale,
            'zh': defaultZhCNLocale,
            'en-US': defaultEnLocale,
            'en': defaultEnLocale,
          },
        })
        if (optionValue)
          return optionValue
        return key
      })

      let matchedIndex = 0
      return i18nProperty.value.replace(/\{(\S+)\}/g, (match, index) => {
        matchedIndex++

        if (typeof translateOptions === 'object' && 'variables' in translateOptions && typeof translateOptions.variables === 'object')
          return translateOptions.variables[index]

        if (Array.isArray(translateOptions) && !Number.isNaN(Number.parseInt(index)))
          return translateOptions[index]

        if (Array.isArray(translateOptions) && translateOptions[matchedIndex - 1])
          return translateOptions[matchedIndex - 1]

        return match
      })
    },
  }
}
