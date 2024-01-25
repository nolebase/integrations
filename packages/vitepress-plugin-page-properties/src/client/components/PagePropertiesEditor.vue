<script setup lang="ts">
import { computed, inject } from 'vue'
import { useData } from 'vitepress'

import { InjectionKey } from '../constants'
import Tag from './Tag/index.vue'
import ProgressBar from './ProgressBar.vue'

const options = inject(InjectionKey, {})
const { frontmatter } = useData()

function getProperty(key: string) {
  return options.properties?.find(item => item.key === key)
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
            <div i-icon-park-outline:tag-one mr-1 />
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
          <template v-if="(value.pageProperty && value.pageProperty.type === 'tags' || typeof value.value === 'object') && Array.isArray(value.value)">
            <template
              v-for="(valueItem, valueItemIndex) in value.value"
              :key="valueItemIndex"
            >
              <Tag :id="String(valueItemIndex)" :tag="{ content: valueItem }">
                {{ valueItem }}
              </Tag>
            </template>
          </template>
          <template v-else-if="(value.pageProperty && value.pageProperty?.type === 'datetime')">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="datetime"
            >
              <span>
                {{ value.value }}
              </span>
            </div>
          </template>
          <template v-else-if="(value.pageProperty && value.pageProperty?.type === 'progress') && typeof value.value === 'number'">
            <div
              class="vp-nolebase-page-property"
              data-page-property="value"
              data-page-property-type="progress"
              w-full inline-flex items-center
            >
              <ProgressBar :value="value.value" />
            </div>
          </template>
          <template v-else-if="typeof value.value === 'object'">
            <span>{{ value.value }}</span>
          </template>
          <template v-else>
            <span>{{ value.value }}</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
