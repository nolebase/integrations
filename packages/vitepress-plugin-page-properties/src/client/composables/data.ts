import type { PageData } from 'vitepress'
import type { ComputedRef, Ref } from 'vue'

import VirtualPagePropertiesData from 'virtual:nolebase-page-properties'

import { computed, ref, toValue } from 'vue'

type Data = typeof VirtualPagePropertiesData

type AggregatedPageProperties = Array<{
  key: PropertyKey | 'unknown'
  pageProperty: Property<any>
  value: any
  omitEmpty: boolean
}>

function normalizeProperties(
  frontmatter: Record<string, any>,
  propertyConfig: Property<any>,
  calculatedPropertiesActualData: Data[string],
): AggregatedPageProperties[number] {
  const { key } = propertyConfig

  const baseResolvedProperties: AggregatedPageProperties[number] = {
    key: 'unknown',
    pageProperty: propertyConfig,
    value: '',
    omitEmpty: true,
  }

  if (propertyConfig.type === 'dynamic') {
    if (propertyConfig.key)
      baseResolvedProperties.key = propertyConfig.key
    else
      baseResolvedProperties.key = propertyConfig.type

    baseResolvedProperties.value = calculatedPropertiesActualData || ''
    baseResolvedProperties.omitEmpty = false

    return baseResolvedProperties
  }

  if (!key)
    return baseResolvedProperties

  baseResolvedProperties.key = propertyConfig.key

  if ('omitEmpty' in propertyConfig)
    baseResolvedProperties.omitEmpty = !!propertyConfig.omitEmpty

  if (!Object.keys(frontmatter).length || !frontmatter[String(key)])
    return baseResolvedProperties

  baseResolvedProperties.value = frontmatter[String(key)]

  return baseResolvedProperties
}

export function usePageProperties(pageData: Ref<PageData>, userConfiguredPageProperties: ComputedRef<Property<any>[]>) {
  const pagePropertiesData = ref<Data>({ ...VirtualPagePropertiesData })
  if (!pagePropertiesData.value)
    pagePropertiesData.value = { }

  return {
    config: computed<AggregatedPageProperties>(() => {
      if (!userConfiguredPageProperties.value || !userConfiguredPageProperties.value.length)
        return []

      const currentPath = toValue(pageData.value.filePath).toLowerCase()
      const matchedPagePropertiesForCurrentPath = pagePropertiesData.value[currentPath]
      if (!matchedPagePropertiesForCurrentPath || !Object.keys(matchedPagePropertiesForCurrentPath).length)
        return []

      const mPageProperties = userConfiguredPageProperties.value.map(item => normalizeProperties(
        pageData.value.frontmatter,
        item,
        matchedPagePropertiesForCurrentPath,
      ))

      return mPageProperties.filter((item) => {
        if (item.omitEmpty && !item.value)
          return false

        return true
      })
    }),
    data: computed<Data[string]>(() => {
      const currentPath = toValue(pageData.value.filePath).toLowerCase()
      const matchedPagePropertiesForCurrentPath = pagePropertiesData.value[currentPath]
      if (!matchedPagePropertiesForCurrentPath || !Object.keys(matchedPagePropertiesForCurrentPath).length)
        return { readingTime: 0, wordsCount: 0 }

      return {
        readingTime: matchedPagePropertiesForCurrentPath.readingTime || 0,
        wordsCount: matchedPagePropertiesForCurrentPath.wordsCount || 0,
      }
    }),
    update(data: typeof VirtualPagePropertiesData) {
      pagePropertiesData.value = { ...data }
    },
  }
}
