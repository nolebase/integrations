<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import MenuTitle from './MenuTitle.vue'
import ScreenLayoutSwitch from './ScreenLayoutSwitch.vue'
import ScreenSpotlight from './ScreenSpotlight.vue'

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <div space-y-2 v-if="mounted" class="VPNolebaseEnhancedReadabilitiesMenu">
    <MenuTitle
      icon="i-icon-park-outline:book-open"
      :title="t('title.title')"
      :aria-label="t('title.titleArialLabel') || t('title.title')"
    />
    <div flex="~ col" pl-4 space-y-2>
      <ScreenLayoutSwitch />
      <ScreenSpotlight />
    </div>
  </div>
</template>
