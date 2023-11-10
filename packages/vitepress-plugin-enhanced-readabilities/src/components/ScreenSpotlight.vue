<script setup lang="ts">
import { useI18n } from '../composables/i18n'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import { useMediaQuery } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';

const disabled = ref(true)

const { t } = useI18n()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')

onMounted(() => {
  if (isLargerThanMobile.value) {
    disabled.value = false
  }
})

watch(isLargerThanMobile, () => {
  if (isLargerThanMobile.value) {
    disabled.value = false
  }
})
</script>

<template>
  <div space-y-2>
    <MenuTitle
      icon="i-icon-park-outline:click"
      :title="t('spotlight.title')"
      :aria-label="t('spotlight.titleArialLabel') || t('spotlight.title')"
      disabled
    />
    <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
      <span text-xs>{{ t('spotlight.titleScreenNavWarningMessage') }}</span>
    </div>
    <div flex="~ row" text="sm $vp-nolebase-enhanced-readabilities-menu-text-color" space-x-2 w-full>
      <MenuOption
        :value="true"
        :title="t('spotlight.optionOn')"
        :aria-label="t('spotlight.optionOnAriaLabel')"
        text="ON"
        name="VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch"
        disabled
      />
      <MenuOption
        :value="false"
        :title="t('spotlight.optionOff')"
        :aria-label="t('spotlight.optionOffAriaLabel')"
        text="OFF"
        name="VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch"
        disabled
      />
    </div>
  </div>
</template>
