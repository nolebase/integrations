<script setup lang="ts">
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import LayoutSwitchLayoutIcon from './MenuIcon.vue'
import LayoutSwitch from './LayoutSwitch.vue'
import MouseOverElementHighlight from './HighlightParagraph.vue'
</script>

<template>
  <VPFlyout :icon="LayoutSwitchLayoutIcon" class="VPNavBarNolebaseEnhancedReadabilitiesMenu">
    <div space-y-2 p-2>
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

@media (min-width: 1280px) {
  .VPNavBarNolebaseEnhancedReadabilitiesMenu {
    display: flex;
    align-items: center;
  }
}
</style>
