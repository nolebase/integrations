<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import { VPFlyout } from './deps'

import LayoutSwitch from './LayoutSwitch.vue'
import LayoutSwitchContentLayoutWidthInput from './LayoutSwitchContentLayoutMaxWidthSlider.vue'
import LayoutSwitchPageLayoutWidthInput from './LayoutSwitchPageLayoutMaxWidthSlider.vue'
import Spotlight from './Spotlight.vue'
import SpotlightStyles from './SpotlightStyles.vue'

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <VPFlyout
    icon="i-icon-park-outline:book-open"
    class="VPNolebaseEnhancedReadabilitiesMenu VPNolebaseEnhancedReadabilitiesMenuFlyout"
    :aria-label="t('title.title')"
    role="menuitem"
  >
    <div v-if="mounted" :aria-label="t('title.title')" min-w-64 p-2 space-y-2>
      <LayoutSwitch />
      <LayoutSwitchPageLayoutWidthInput />
      <LayoutSwitchContentLayoutWidthInput />
      <Spotlight />
      <SpotlightStyles />
    </div>
  </VPFlyout>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: #EBEDF2;
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: #2c2f35;
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.VPNolebaseEnhancedReadabilitiesMenuFlyout {
  display: none;
}

.VPNolebaseEnhancedReadabilitiesMenuFlyout::before {
  margin-right: 8px;
  margin-left: 8px;
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  content: "";
}

@media (min-width: 768px) {
  .VPNolebaseEnhancedReadabilitiesMenuFlyout {
    display: flex;
    align-items: center;
  }
}
</style>
