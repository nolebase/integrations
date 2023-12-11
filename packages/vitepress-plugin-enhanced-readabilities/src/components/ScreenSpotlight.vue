<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from '../composables/i18n'

import MenuTitle from './MenuTitle.vue'
import MenuOptions from './MenuOptions.vue'

const { t } = useI18n()

const fieldOptions = computed(() => [
  {
    title: t('spotlight.optionOn'),
    ariaLabel: t('spotlight.optionOnAriaLabel'),
    value: true,
    text: 'ON',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch',
  },
  {
    title: t('spotlight.optionOff'),
    ariaLabel: t('spotlight.optionOffAriaLabel'),
    value: false,
    text: 'OFF',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch',
  },
])
</script>

<template>
  <div space-y-2>
    <MenuTitle
      icon="i-icon-park-outline:click"
      :title="t('spotlight.title')"
      :aria-label="t('spotlight.titleArialLabel') || t('spotlight.title')"
      disabled
    />
    <div border="1 red/50 solid" bg="red/30" flex items-center rounded-lg p-2 opacity-50>
      <span text-xs>{{ t('spotlight.titleScreenNavWarningMessage') }}</span>
    </div>
    <MenuOptions
      :options="fieldOptions"
      disabled
    />
  </div>
</template>
