<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from '../composables/i18n'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'

const disabled = ref(true)

const { t } = useI18n()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')

onMounted(() => {
  if (isLargerThanMobile.value)
    disabled.value = false
})

watch(isLargerThanMobile, () => {
  if (isLargerThanMobile.value)
    disabled.value = false
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
    <div border="1 red/50 solid" bg="red/30" flex items-center rounded-xl p-2 opacity-50>
      <span text-xs>{{ t('spotlight.titleScreenNavWarningMessage') }}</span>
    </div>
    <div
      flex="~ row"

      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      w-full rounded-lg border-none p-1 space-x-2
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
    >
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
