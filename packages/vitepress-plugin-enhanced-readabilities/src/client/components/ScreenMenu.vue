<script setup lang="ts">
import { useMounted } from '@vueuse/core'

import MenuTitle from './MenuTitle.vue'
import ScreenLayoutSwitch from './ScreenLayoutSwitch.vue'
import ScreenSpotlight from './ScreenSpotlight.vue'

import { useI18n } from '../composables/i18n'

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <MenuTitle
      :title="t('title.title')"
      :aria-label="t('title.titleAriaLabel') || t('title.title')"
    >
      <template #icon>
        <span i-icon-park-outline:book-open mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div flex="~ col" pl-4 space-y-2>
      <ScreenLayoutSwitch />
      <ScreenSpotlight />
    </div>
  </div>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(--vp-c-bg-soft, #e8e8e8);
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(--vp-c-bg-soft, #2c2f35);
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}
</style>
