<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed } from 'vue'

import MenuTitle from './MenuTitle.vue'

import { useI18n } from '../composables/i18n'

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
      :title="t('spotlight.title')"
      :aria-label="t('spotlight.titleAriaLabel') || t('spotlight.title')"
      disabled
    >
      <template #icon>
        <span i-icon-park-outline:click mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div border="1 red/50 solid" bg="red/30" flex items-center rounded-lg p-2 opacity-50>
      <span text-xs>{{ t('spotlight.titleScreenNavWarningMessage') }}</span>
    </div>
    <NuInputHorizontalRadioGroup
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="fieldOptions"
      disabled
    />
  </div>
</template>
