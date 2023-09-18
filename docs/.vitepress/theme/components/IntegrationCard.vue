<script setup lang="ts">
import { useData } from 'vitepress'
import VitePressLogo from '../assets/vitepress-logo-large.webp'

enum IntegrationType {
  markdownIt = 'markdown-it',
  vitepress = 'vitepress',
}

const props = defineProps<{
  type: IntegrationType
  title: string
  package: string
}>()

const data = useData()
</script>

<template>
  <a :href="`/pages/${data.lang.value}/integrations/${props.package}/`"
    p-4
    flex="~ row" items-center
    bg="zinc-100 hover:zinc-200 active:zinc-300 dark:zinc-900 dark:hover:zinc-800 dark:active:zinc-900"
    rounded-lg
    transition="all duration-200 ease"
    select-none cursor-pointer
    class="text-$vp-c-text-1!">
    <span flex="~ col 1">
      <span>{{ props.title }}</span>
      <span>@nolebase/{{ props.package }}</span>
    </span>
    <template v-if="props.type === IntegrationType.markdownIt">
      <span class="i-octicon:markdown-16" text-5xl w-15 h-15 />
    </template>
    <template v-else-if="props.type === IntegrationType.vitepress">
      <img :src="VitePressLogo" w-15 h-15 />
    </template>
  </a>
</template>
