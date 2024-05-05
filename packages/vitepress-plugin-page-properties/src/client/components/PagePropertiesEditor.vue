<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'
import { NuTag } from '@nolebase/ui'

import { InjectionKey } from '../constants'
import {
  isDatetimeProperty,
  isDynamicCustomProperty,
  isDynamicReadingTimeProperty,
  isDynamicWordsCountProperty,
  isLinkProperty,
  isPlainProperty,
  isProgressProperty,
  isTagsProperty,
} from '../composables/propertyType'
import { useRawPath } from '../composables/path'
import { useI18n } from '../composables/i18n'
import { usePageProperties } from '../composables/data'
import { formatDurationFromValue } from '../utils'

import type { Property } from '../types'
import ProgressBar from './ProgressBar.vue'
import Datetime from './Datetime.vue'

const options = inject(InjectionKey, {})
const vitePressData = useData()
const { lang, frontmatter } = vitePressData
const { t } = useI18n()
const rawPath = useRawPath()
const pagePropertiesData = usePageProperties()

const pageProperties = computed(() => {
  if (!options.properties)
    return []
  if (!options.properties[lang.value])
    return []

  return options.properties[lang.value]
})

if (import.meta.hot) {
  // Plugin API | Vite
  // https://vitejs.dev/guide/api-plugin.html#handlehotupdate
  import.meta.hot.on('nolebase-page-properties:updated', (data) => {
    if (!data || typeof data !== 'object')
      return

    pagePropertiesData.applyPagePropertiesData(data)
  })

  // HMR API | Vite
  // https://vitejs.dev/guide/api-hmr.html
  import.meta.hot.accept('virtual:nolebase-page-properties', (newModule) => {
    if (!newModule)
      return
    if (!('default' in newModule))
      return
    if (!newModule.default || typeof newModule.default !== 'object')
      return

    pagePropertiesData.applyPagePropertiesData(newModule.default)
  })
}

type AggregatedPageProperties = Array<{
  key: PropertyKey | 'unknown'
  pageProperty: Property<any>
  value: any
  omitEmpty: boolean
}>

const frontmatterAggregated = computed(() => {
  if (!pageProperties.value || pageProperties.value.length === 0)
    return []

  const mPageProperties: AggregatedPageProperties = pageProperties.value.map((item) => {
    const { key } = item

    const baseResolvedProperties: AggregatedPageProperties[number] = {
      key: 'unknown',
      pageProperty: item,
      value: '',
      omitEmpty: true,
    }

    if (item.type === 'dynamic') {
      if (item.key)
        baseResolvedProperties.key = item.key
      else
        baseResolvedProperties.key = item.type

      baseResolvedProperties.value = pagePropertiesData.data[rawPath.value] ? pagePropertiesData.data[rawPath.value] : ''
      baseResolvedProperties.omitEmpty = false

      return baseResolvedProperties
    }

    if (!key)
      return baseResolvedProperties

    baseResolvedProperties.key = item.key

    if ('omitEmpty' in item)
      baseResolvedProperties.omitEmpty = !!item.omitEmpty

    if (!frontmatter.value[String(key)])
      return baseResolvedProperties

    baseResolvedProperties.value = frontmatter.value[String(key)]

    return baseResolvedProperties
  })

  return mPageProperties.filter((item) => {
    if (item.omitEmpty && !item.value)
      return false

    return true
  })
})

const wordsCount = computed(() => {
  if (!pagePropertiesData.data[rawPath.value] || !pagePropertiesData.data[rawPath.value].wordsCount)
    return 0

  return pagePropertiesData.data[rawPath.value].wordsCount
})

const readingTime = computed(() => {
  if (!pagePropertiesData.data[rawPath.value] || !pagePropertiesData.data[rawPath.value].readingTime)
    return 0

  return pagePropertiesData.data[rawPath.value].readingTime
})
</script>

<template>
  <div my-4>
    <div class="grid grid-cols-[180px_auto] gap-1 <sm:grid-cols-[120px_auto]">
      <template v-for="(property) of frontmatterAggregated" :key="property.key">
        <div
          transition="all ease-in-out"
          flex items-start
          text="zinc-400 dark:zinc-500 sm <sm:xs"
          duration-250
        >
          <div
            transition="all ease-in-out"
            min-h="8 <sm:7"
            px="2 <sm:1" py="2 <sm:1"
            w-full flex cursor-pointer items-center
            bg="hover:zinc-100 dark:hover:zinc-800"
            rounded-md
            duration-250
          >
            <template v-if="isTagsProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:tag-one mr-1 />
            </template>
            <template v-else-if="isDatetimeProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:time mr-1 />
            </template>
            <template v-else-if="isProgressProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:loading mr-1 />
            </template>
            <template v-else-if="isPlainProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:align-text-left mr-1 />
            </template>
            <template v-else-if="isLinkProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:link-one mr-1 />
            </template>
            <template v-else-if="isDynamicWordsCountProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:add-text mr-1 />
            </template>
            <template v-else-if="isDynamicReadingTimeProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:timer mr-1 />
            </template>
            <template v-else-if="isDynamicCustomProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:block-nine mr-1 />
            </template>
            <template v-else-if="typeof property.value === 'object'">
              <div i-icon-park-outline:triangle-round-rectangle mr-1 />
            </template>
            <template v-else>
              <div i-icon-park-outline:align-text-left mr-1 />
            </template>
            <span
              overflow-hidden
              text-ellipsis
              whitespace-nowrap
            >{{ property.pageProperty?.title ?? property.key }}</span>
          </div>
        </div>
        <div
          cursor-pointer
          transition="all ease-in-out"
          min-h="8 <sm:7"
          px="2 <sm:1" py="1.5 <sm:1"
          flex="~ row wrap" items-center gap-1
          rounded-md
          text="sm <sm:xs"
          bg="hover:zinc-100 dark:hover:zinc-800"
          duration-250
        >
          <template v-if="isTagsProperty(property.value, property.pageProperty)">
            <template
              v-for="(valueItem, valueItemIndex) in property.value"
              :key="valueItemIndex"
            >
              <NuTag :id="String(valueItemIndex)" :tag="{ content: valueItem }">
                {{ valueItem }}
              </NuTag>
            </template>
          </template>
          <template v-else-if="isDatetimeProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="datetime"
            >
              <Datetime :value="property.value" :page-property="property.pageProperty" />
            </div>
          </template>
          <template v-else-if="isProgressProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="progress"
              w-full inline-flex items-center
            >
              <ProgressBar :value="property.value" />
            </div>
          </template>
          <template v-else-if="isLinkProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="link"
              w-full inline-flex items-center
            >
              <a :href="property.value" target="_blank">
                <span>{{ property.value }}</span>
              </a>
            </div>
          </template>
          <template v-else-if="isPlainProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="plain"
              w-full inline-flex items-center
            >
              <span>{{ property.value }}</span>
            </div>
          </template>
          <template v-else-if="isDynamicWordsCountProperty(property.value, property.pageProperty) && property.pageProperty.options.type === 'wordsCount'">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="dynamic"
              data-page-property-dynamic-type="word-count"
              w-full inline-flex items-center
            >
              <span>{{ t('pageProperties.wordsCount', { props: { wordsCount } }) }}</span>
            </div>
          </template>
          <template v-else-if="isDynamicReadingTimeProperty(property.value, property.pageProperty) && property.pageProperty.options.type === 'readingTime'">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="dynamic"
              data-page-property-dynamic-type="reading-time"
              w-full inline-flex items-center
            >
              <span>{{ formatDurationFromValue(readingTime, property.pageProperty.options.dateFnsLocaleName || lang) }}</span>
            </div>
          </template>
          <template v-else-if="isDynamicCustomProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="dynamic"
              data-page-property-dynamic-type="custom"
              w-full inline-flex items-center
            >
              <span>{{ property.pageProperty.options.getter(vitePressData) }}</span>
            </div>
          </template>
          <template v-else-if="typeof property.value === 'object'">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="object"
              w-full inline-flex items-center
            >
              <span>{{ JSON.stringify(property.value) }}</span>
            </div>
          </template>
          <template v-else>
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="plain"
              w-full inline-flex items-center
            >
              <span>{{ property.value }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
