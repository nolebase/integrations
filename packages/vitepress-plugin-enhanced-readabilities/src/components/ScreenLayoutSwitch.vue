<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from '../composables/i18n'
import { LayoutMode } from '../constants'

import MenuTitle from './MenuTitle.vue'
import MenuOptions from './MenuOptions.vue'

const { t } = useI18n()

const fieldOptions = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: t('layoutSwitch.optionFullWidth'),
    ariaLabel: t('layoutSwitch.optionFullWidthAriaLabel'),
    icon: 'i-icon-park-outline:full-screen-one',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: t('layoutSwitch.optionSidebarWidthAdjustableOnly'),
    ariaLabel: t('layoutSwitch.optionSidebarWidthAdjustableOnlyAriaLabel'),
    icon: 'i-icon-park-outline:full-screen-two',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: t('layoutSwitch.optionBothWidthAdjustable'),
    ariaLabel: t('layoutSwitch.optionBothWidthAdjustableAriaLabel'),
    icon: 'i-icon-park-outline:full-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.Original,
    title: t('layoutSwitch.optionOriginalWidth'),
    ariaLabel: t('layoutSwitch.optionOriginalWidthAriaLabel'),
    icon: 'i-icon-park-outline:off-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
])
</script>

<template>
  <div space-y-2>
    <MenuTitle
      icon="i-icon-park-outline:layout-one"
      :title="t('layoutSwitch.title')"
      :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
      disabled
    />
    <div border="1 red/50 solid" bg="red/30" flex items-center rounded-lg p-2 opacity-50>
      <span text-xs>{{ t('layoutSwitch.titleScreenNavWarningMessage') }}</span>
    </div>
    <MenuOptions
      :options="fieldOptions"
      disabled
    />
  </div>
</template>
