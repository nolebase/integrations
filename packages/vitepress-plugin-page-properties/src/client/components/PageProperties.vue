<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useData } from 'vitepress'

import PagePropertiesData from 'virtual:nolebase-page-properties'

import { InjectionKey } from '../constants'
import {
  isDatetimeProperty,
  isDynamicReadingTimeProperty,
  isDynamicWordCountProperty,
  isLinkProperty,
  isPlainProperty,
  isProgressProperty,
  isTagsProperty,
} from '../composables/propertyType'
import { useRawPath } from '../composables/path'
import Tag from './Tag/index.vue'
import ProgressBar from './ProgressBar.vue'
import Datetime from './Datetime.vue'

const pagePropertiesData = ref<typeof PagePropertiesData>(PagePropertiesData)
const options = inject(InjectionKey, {})
const { lang, frontmatter } = useData()
const rawPath = useRawPath()

const pageProperties = computed(() => {
  if (!options.properties)
    return []
  if (!options.properties[lang.value])
    return []

  return options.properties[lang.value]
})

if (import.meta.hot) {
  import.meta.hot.accept('virtual:nolebase-page-properties', (newModule) => {
    if (newModule)
      pagePropertiesData.value = newModule.default
  })
}

type AggregatedPageProperties = Array<{
  key: PropertyKey | 'unknown'
  pageProperty: Property<any>
  value: any
}>

const frontmatterAggregated = computed(() => {
  if (!pageProperties.value || pageProperties.value.length === 0)
    return []

  const mPageProperties: AggregatedPageProperties = pageProperties.value.map((item) => {
    const { key } = item
    if (!key) {
      return {
        key: 'unknown',
        pageProperty: item,
        value: '',
      }
    }

    if (item.type === 'dynamic') {
      return {
        key,
        pageProperty: item,
        value: pagePropertiesData.value[rawPath.value] ? pagePropertiesData.value[rawPath.value] : {},
      }
    }

    if (!frontmatter.value[String(key)]) {
      return {
        key,
        pageProperty: item,
        value: '',
      }
    }

    return {
      key,
      pageProperty: item,
      value: frontmatter.value[String(key)],
    }
  })

  return mPageProperties
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
            <template v-else-if="isDynamicWordCountProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:add-text mr-1 />
            </template>
            <template v-else-if="isDynamicReadingTimeProperty(property.value, property.pageProperty)">
              <div i-icon-park-outline:timer mr-1 />
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
              <Tag :id="String(valueItemIndex)" :tag="{ content: valueItem }">
                {{ valueItem }}
              </Tag>
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
          <template v-else-if="isDynamicWordCountProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="dynamic"
              data-page-property-dynamic-type="word-count"
              w-full inline-flex items-center
            >
              <span>{{ pagePropertiesData[rawPath] && pagePropertiesData[rawPath].wordsCount ? pagePropertiesData[rawPath].wordsCount : 0 }}</span>
            </div>
          </template>
          <template v-else-if="isDynamicReadingTimeProperty(property.value, property.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="dynamic"
              data-page-property-dynamic-type="reading-time"
              w-full inline-flex items-center
            >
              <span>{{ pagePropertiesData[rawPath] && pagePropertiesData[rawPath].readingTime ? pagePropertiesData[rawPath].readingTime : 0 }}</span>
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

<style scoped>
</style>
