<script setup lang="ts">
import { LayoutMode } from '../types'
import { useI18n } from '../composables/i18n'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import { useMediaQuery } from '@vueuse/core';
import { onMounted, watch } from 'vue';

const { t } = useI18n()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')

onMounted(() => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, switching to FitContentWidth layout mode.')
  }
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, switching to FitContentWidth layout mode.')
  }
})
</script>

<template>
  <div space-y-2>
    <MenuTitle
      icon="i-icon-park-outline:layout-one"
      :title="t('layoutSwitch.title')"
      :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
      disabled
    />
    <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
      <span text-xs>{{ t('layoutSwitch.titleScreenNavWarningMessage') }}</span>
    </div>
    <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
      <MenuOption
      :value="LayoutMode.FullWidth"
      icon="i-icon-park-outline:full-screen-one"
      :title="t('layoutSwitch.optionFullWidth')"
      :aria-label="t('layoutSwitch.optionFullWidthAriaLabel')"
      name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      disabled
      />
      <MenuOption
      :value="LayoutMode.OnlySidebarFullWidth"
      icon="i-icon-park-outline:off-screen"
      :title="t('layoutSwitch.optionOnlySidebarFullWidth')"
      :aria-label="t('layoutSwitch.optionOnlySidebarFullWidthAriaLabel')"
      name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      disabled
      />
      <MenuOption
      :value="LayoutMode.FitContentWidth"
      icon="i-icon-park-outline:off-screen-one"
      :title="t('layoutSwitch.optionFitContentWidth')"
      :aria-label="t('layoutSwitch.optionFitContentWidthAriaLabel')"
      name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      disabled
      />
    </div>
  </div>
</template>
