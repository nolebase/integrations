<script setup lang="ts">
import { useData } from 'vitepress'
import Tag from './Tag/index.vue'

const { frontmatter } = useData()
</script>

<template>
  <div my-4>
    <div class="grid grid-cols-[180px_auto] gap-0.5 <sm:grid-cols-[120px_auto]">
      <template v-for="(value, key) in frontmatter" :key="key">
        <div
          transition="all ease-in-out"
          flex items-start
          text="zinc-300 dark:zinc-500 sm <sm:xs"
          duration-250
        >
          <div
            transition="all ease-in-out"
            min-h="8 <sm:7"
            px="1" py="1"
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
            >{{ key }}</span>
          </div>
        </div>
        <div
          cursor-pointer
          transition="all ease-in-out"
          min-h="8 <sm:7"
          px="1" py="1"
          flex="~ row wrap" items-start gap-1
          rounded-md
          text="sm <sm:xs"
          bg="hover:zinc-100 dark:hover:zinc-800"
          duration-250
        >
          <template v-if="typeof value === 'object' && Array.isArray(value)">
            <template v-for="(valueItem, valueItemIndex) in value" :key="valueItemIndex">
              <Tag :id="String(valueItemIndex)" :tag="{ content: valueItem }">
                {{ valueItem }}
              </Tag>
            </template>
          </template>
          <template v-else-if="typeof value === 'object'">
            <span>Object: {{ value }}</span>
          </template>
          <template v-else>
            <span>Value: {{ value }}</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
