<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'

import { useI18n } from '../composables/i18n'
import { LayoutMode } from '../constants'

import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'

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
      icon="i-icon-park-outline:layout-one"
      :title="t('layoutSwitch.title')"
      :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
      :disabled="disabled"
    />
    <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
      <span text-xs>{{ t('layoutSwitch.titleScreenNavWarningMessage') }}</span>
    </div>
    <div flex="~ row" text="sm $vp-nolebase-enhanced-readabilities-menu-text-color" space-x-2 w-full>
      <MenuOption
        :value="LayoutMode.FullWidth"
        :title="t('layoutSwitch.optionFullWidth')"
        :aria-label="t('layoutSwitch.optionFullWidthAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen-one"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
        :value="LayoutMode.SidebarWidthAdjustableOnly"
        :title="t('layoutSwitch.optionSidebarWidthAdjustableOnly')"
        :aria-label="t('layoutSwitch.optionSidebarWidthAdjustableOnlyAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen-two"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
        :value="LayoutMode.BothWidthAdjustable"
        :title="t('layoutSwitch.optionBothWidthAdjustable')"
        :aria-label="t('layoutSwitch.optionBothWidthAdjustableAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
      :value="LayoutMode.Original"
        :title="t('layoutSwitch.optionOriginalWidth')"
        :aria-label="t('layoutSwitch.optionOriginalWidthAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:off-screen"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
    </div>
  </div>
</template>
