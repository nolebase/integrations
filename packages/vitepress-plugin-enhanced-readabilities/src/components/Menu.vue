<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'

import { useI18n } from '../composables/i18n'

import LayoutSwitchLayoutIcon from './MenuIcon.vue'
import LayoutSwitch from './LayoutSwitch.vue'
import MouseOverElementHighlight from './Spotlight.vue'
import LayoutSwitchPageLayoutWidthInput from './LayoutSwitchPageLayoutMaxWidthSlider.vue'
import LayoutSwitchContentLayoutWidthInput from './LayoutSwitchContentLayoutMaxWidthSlider.vue'

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <VPFlyout
    :icon="LayoutSwitchLayoutIcon"
    class="VPNolebaseEnhancedReadabilitiesMenu VPNolebaseEnhancedReadabilitiesMenuFlyout"
  >
    <div v-if="mounted" space-y-2 p-2 :aria-label="t('title.title')" min-w-64>
      <LayoutSwitch />
      <LayoutSwitchPageLayoutWidthInput />
      <LayoutSwitchContentLayoutWidthInput />
      <MouseOverElementHighlight />
    </div>
  </VPFlyout>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesMenuFlyout {
  display: none;

  &::before {
    margin-right: 8px;
    margin-left: 8px;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
    content: "";
  }
}

@media (min-width: 768px) {
  .VPNolebaseEnhancedReadabilitiesMenuFlyout {
    display: flex;
    align-items: center;
  }
}
</style>
