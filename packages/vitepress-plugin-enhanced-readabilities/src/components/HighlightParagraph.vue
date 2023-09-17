<script setup lang="ts">
import MenuOption from './MenuOption.vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import HighlightParagraphHighlighter from './HighlightParagraphHighlighter.vue'
import MenuTitle from './MenuTitle.vue'
import { onMounted, watch } from 'vue'

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const paragraphHighlightModeOn = useStorage('vp-nolebase-enhanced-readabilities-paragraph-highlight-mode', false)

onMounted(() => {
  if (!isLargerThanMobile.value) {
    paragraphHighlightModeOn.value = false
  }
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    paragraphHighlightModeOn.value = false
  }
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <HighlightParagraphHighlighter v-if="mounted && paragraphHighlightModeOn" :enabled="paragraphHighlightModeOn" />
    <MenuTitle icon="i-icon-park-outline:click" title="行内高亮" />
    <fieldset flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full appearance-none border-none>
      <MenuOption
        v-model="paragraphHighlightModeOn"
        title="开启"
        text="ON"
        name="paragraph-highlight-switch"
        :value="true"
      />
      <MenuOption
        v-model="paragraphHighlightModeOn"
        title="关闭"
        text="OFF"
        name="paragraph-highlight-switch"
        :value="false"
      />
    </fieldset>
  </div>
</template>
