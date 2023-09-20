<script setup lang="ts">
import { useI18n } from '../composables/i18n'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import { useMediaQuery } from '@vueuse/core';
import { onMounted, watch } from 'vue';

const { t } = useI18n()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')

onMounted(() => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, disabled inline highlight mode.')
  }
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, disabled inline highlight mode.')
  }
})
</script>

<template>
  <div space-y-2>
    <MenuTitle
      icon="i-icon-park-outline:click"
      :title="t('inlineHighlight.title')"
      :aria-label="t('inlineHighlight.titleArialLabel') || t('inlineHighlight.title')"
      disabled
    />
    <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
      <span text-xs>{{ t('inlineHighlight.titleScreenNavWarningMessage') }}</span>
    </div>
    <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
      <MenuOption
        :value="true"
        :title="t('inlineHighlight.optionOn')"
        :aria-label="t('inlineHighlight.optionOnAriaLabel')"
        text="ON"
        name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
        disabled
      />
      <MenuOption
        :value="false"
        :title="t('inlineHighlight.optionOff')"
        :aria-label="t('inlineHighlight.optionOffAriaLabel')"
        text="OFF"
        name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
        disabled
      />
    </div>
  </div>
</template>
