<script setup lang="ts">
import { useData } from 'vitepress'
import VitePressLogo from '../assets/vitepress-logo-large.webp'
import ObsidianLogo from '../assets/obsidian-logo.svg'

const props = defineProps<{
  type: IntegrationType
  title: string
  package: string
}>()

enum IntegrationType {
  markdownIt = 'markdown-it',
  vitepress = 'vitepress',
  obsidian = 'obsidian',
}

const data = useData()
</script>

<template>
  <a
    :href="`/pages/${data.lang.value}/integrations/${props.package}/`"

    flex="~ row"
    bg="zinc-100 hover:zinc-200 active:zinc-300 dark:zinc-900 dark:hover:zinc-800 dark:active:zinc-900"

    transition="all duration-200 ease"
    cursor-pointer select-none items-center rounded-lg p-4
    class="text-$vp-c-text-1!"
  >
    <span v-if="props.type === IntegrationType.markdownIt || props.type === IntegrationType.vitepress" flex="~ col 1">
      <span>{{ props.title }}</span>
      <span>@nolebase/{{ props.package }}</span>
    </span>
    <span v-if="props.type === IntegrationType.obsidian" flex="~ col 1">
      <span>{{ props.title }}</span>
      <span>{{ props.package }}</span>
    </span>
    <template v-if="props.type === IntegrationType.markdownIt">
      <span class="i-octicon:markdown-16" h-15 w-15 text-5xl />
    </template>
    <template v-else-if="props.type === IntegrationType.vitepress">
      <img :src="VitePressLogo" h-15 w-15>
    </template>
    <template v-else-if="props.type === IntegrationType.obsidian">
      <img :src="ObsidianLogo" h-15 w-15>
    </template>
  </a>
</template>
