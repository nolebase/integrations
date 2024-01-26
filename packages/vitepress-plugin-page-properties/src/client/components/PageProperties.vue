<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'

import { InjectionKey } from '../constants'
import { isDatetimeProperty, isLinkProperty, isPlainProperty, isProgressProperty, isTagsProperty } from '../composables/propertyType'
import Tag from './Tag/index.vue'
import ProgressBar from './ProgressBar.vue'
import Datetime from './Datetime.vue'

const options = inject(InjectionKey, {})
const { lang, frontmatter } = useData()

function getProperty(key: string) {
  if (!options.properties)
    return null
  if (!options.properties[lang.value])
    return null

  return options.properties[lang.value]?.find(item => item.key === key)
}

const frontmatterAggregated = computed(() => {
  return Object.fromEntries(Object.entries(frontmatter.value).map((entry) => {
    const [key, value] = entry

    return [key, {
      pageProperty: getProperty(key),
      value,
    }]
  }))
})
</script>

<template>
  <div my-4>
    <div class="grid grid-cols-[180px_auto] gap-1 <sm:grid-cols-[120px_auto]">
      <template v-for="(value, key) in frontmatterAggregated" :key="key">
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
            <template v-if="isTagsProperty(value.value, value.pageProperty)">
              <div i-icon-park-outline:tag-one mr-1 />
            </template>
            <template v-else-if="isDatetimeProperty(value.value, value.pageProperty)">
              <div i-icon-park-outline:time mr-1 />
            </template>
            <template v-else-if="isProgressProperty(value.value, value.pageProperty)">
              <div i-icon-park-outline:loading mr-1 />
            </template>
            <template v-else-if="isPlainProperty(value.value, value.pageProperty)">
              <div i-icon-park-outline:align-text-left mr-1 />
            </template>
            <template v-else-if="isLinkProperty(value.value, value.pageProperty)">
              <div i-icon-park-outline:link-one mr-1 />
            </template>
            <template v-else-if="typeof value.value === 'object'">
              <div i-icon-park-outline:triangle-round-rectangle mr-1 />
            </template>
            <template v-else>
              <div i-icon-park-outline:align-text-left mr-1 />
            </template>
            <span
              overflow-hidden
              text-ellipsis
              whitespace-nowrap
            >{{ value.pageProperty?.title ?? key }}</span>
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
          <template v-if="isTagsProperty(value.value, value.pageProperty)">
            <template
              v-for="(valueItem, valueItemIndex) in value.value"
              :key="valueItemIndex"
            >
              <Tag :id="String(valueItemIndex)" :tag="{ content: valueItem }">
                {{ valueItem }}
              </Tag>
            </template>
          </template>
          <template v-else-if="isDatetimeProperty(value.value, value.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="datetime"
            >
              <Datetime :value="value.value" :page-property="value.pageProperty" />
            </div>
          </template>
          <template v-else-if="isProgressProperty(value.value, value.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="progress"
              w-full inline-flex items-center
            >
              <ProgressBar :value="value.value" />
            </div>
          </template>
          <template v-else-if="isLinkProperty(value.value, value.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="link"
              w-full inline-flex items-center
            >
              <a :href="value.value" target="_blank">
                <span>{{ value.value }}</span>
              </a>
            </div>
          </template>
          <template v-else-if="isPlainProperty(value.value, value.pageProperty)">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="plain"
              w-full inline-flex items-center
            >
              <span>{{ value.value }}</span>
            </div>
          </template>
          <template v-else-if="typeof value.value === 'object'">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="object"
              w-full inline-flex items-center
            >
              <span>{{ JSON.stringify(value.value) }}</span>
            </div>
          </template>
          <template v-else>
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="plain"
              w-full inline-flex items-center
            >
              <span>{{ value.value }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
