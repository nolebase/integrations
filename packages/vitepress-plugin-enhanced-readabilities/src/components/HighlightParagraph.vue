<script setup lang="ts">
import MenuOption from './MenuOption.vue'
import { useMounted, useStorage } from '@vueuse/core'
import HighlightParagraphHighlighter from './HighlightParagraphHighlighter.vue'
import MenuTitle from './MenuTitle.vue'

const mounted = useMounted()
const paragraphHighlightModeOn = useStorage('vp-nolebase-enhanced-readabilities-paragraph-highlight-mode', false)
</script>

<template>
  <div space-y-2>
    <HighlightParagraphHighlighter v-if="mounted && paragraphHighlightModeOn" :enabled="paragraphHighlightModeOn" />
    <MenuTitle icon="i-icon-park-outline:click" title="行内高亮" />
    <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
      <MenuOption v-model="paragraphHighlightModeOn" :active="paragraphHighlightModeOn" :value="true" title="开启" text="ON" />
      <MenuOption v-model="paragraphHighlightModeOn" :active="!paragraphHighlightModeOn" :value="false" title="关闭" text="OFF" />
    </div>
  </div>
</template>
