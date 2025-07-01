<script setup lang="ts">
import type { LocaleName } from '../types'

import { NuTag } from '@nolebase/ui'
import { useData } from 'vitepress'
import { computed, inject, onMounted } from 'vue'

import Datetime from './Datetime.vue'
import ProgressBar from './ProgressBar.vue'

import { usePageProperties } from '../composables/data'
import { useI18n } from '../composables/i18n'
import {
  isDatetimeProperty,
  isDynamicReadingTimeProperty,
  isDynamicWordsCountProperty,
  isLinkProperty,
  isPlainProperty,
  isProgressProperty,
  isTagsProperty,
} from '../composables/propertyType'
import { InjectionKey } from '../constants'
import { formatDurationFromValue } from '../utils'

const options = inject(InjectionKey, {})
const { lang, page } = useData()
const { t } = useI18n()

const pageProperties = computed(() => {
  if (!options.properties)
    return []
  if (!options.properties[lang.value])
    return []

  return options.properties[lang.value]
})

const { config, data, update } = usePageProperties(page, pageProperties)

onMounted(() => {
  if (import.meta.hot) {
    import.meta.hot.send('nolebase-page-properties:client-mounted', {
      page: {
        filePath: page.value.filePath,
      },
    })

    // Plugin API | Vite
    // https://vitejs.dev/guide/api-plugin.html#handlehotupdate
    import.meta.hot.on('nolebase-page-properties:updated', (data) => {
      if (!data || typeof data !== 'object')
        return

      if (data)
        update(data)
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

      if (newModule.default)
        update(newModule.default)
    })
  }
})
</script>

<template>
  <div my-4 class="vp-nolebase-page-properties vp-nolebase-page-properties-container">
    <div class="vp-nolebase-page-properties-grid grid grid-cols-[180px_auto] gap-1 <sm:grid-cols-[120px_auto]">
      <template v-for="(property) of config" :key="property.key">
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
              <span>{{ t('pageProperties.wordsCount', { props: { wordsCount: data.wordsCount } }) }}</span>
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
              <span>{{ formatDurationFromValue(data.readingTime, property.pageProperty.options.dateFnsLocaleName || (lang as unknown as LocaleName) || 'enUS') }}</span>
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
