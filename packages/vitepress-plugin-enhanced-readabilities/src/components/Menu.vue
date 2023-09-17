<script setup lang="ts">
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import LayoutSwitchLayoutIcon from './MenuIcon.vue'
import LayoutSwitch from './LayoutSwitch.vue'
import MouseOverElementHighlight from './InlineHighlight.vue'
import { useMounted } from '@vueuse/core';
import { useI18n } from '../composables/i18n';

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <VPFlyout
    :icon="LayoutSwitchLayoutIcon"
    class="VPNavBarNolebaseEnhancedReadabilitiesMenu"
  >
    <div v-if="mounted" space-y-2 p-2 :aria-label="t('title.title')">
      <LayoutSwitch />
      <MouseOverElementHighlight />
    </div>
  </VPFlyout>
</template>

<style less>
.VPNavBarNolebaseEnhancedReadabilitiesMenu {
  display: none;

  &::before {
    margin-right: 8px;
    margin-left: 16px;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
    content: "";
  }
}

@media (min-width: 768px) {
  .VPNavBarNolebaseEnhancedReadabilitiesMenu {
    display: flex;
    align-items: center;
  }
}
</style>
