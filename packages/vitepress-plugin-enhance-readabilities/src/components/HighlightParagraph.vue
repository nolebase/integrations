<script setup lang="ts">
import MenuOption from './MenuOption.vue'
import HighlightParagraphHighlighter from './HighlightParagraphHighlighter.vue'
import { useMounted, useStorage } from '@vueuse/core'

const mounted = useMounted()
const paragraphHighlightModeOn = useStorage('vp-nolebase-enhanced-readabilities-paragraph-highlight-mode', false)
</script>

<template>
  <div space-y-2>
    <HighlightParagraphHighlighter v-if="mounted && paragraphHighlightModeOn" :enabled="paragraphHighlightModeOn" />
    <h3 inline-flex items-center text="[14px] $vp-c-text-1" font-medium align-middle select-none>
      <span i-icon-park-outline:click mr-1 />
        <span>行内高亮</span>
    </h3>
    <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
      <MenuOption v-model="paragraphHighlightModeOn" :active="paragraphHighlightModeOn" :value="true" title="开启" text="ON" />
      <MenuOption v-model="paragraphHighlightModeOn" :active="!paragraphHighlightModeOn" :value="false" title="关闭" text="OFF" />
    </div>
  </div>
</template>
