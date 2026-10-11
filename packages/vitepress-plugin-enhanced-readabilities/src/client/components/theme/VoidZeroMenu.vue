<script setup lang="ts">
import { nextTick, onMounted, shallowRef } from 'vue'

import NolebaseEnhancedReadabilitiesMenu from '../Menu.vue'

const target = shallowRef<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  // NOTICE:
  // VoidZero 5.0.2's OSSHeader only exposes nav-bar-title-before/after slots.
  // The right-side toolbar has no slot equivalent to VitePress nav-bar-content-after.
  // Source/context: node_modules/@voidzero-dev/vitepress-theme/src/components/oss/Header.vue.
  // Removal condition: replace this Teleport with a normal slot when VoidZero exposes one.
  target.value = document.querySelector('.docs-layout header.wrapper > div:last-child')
})
</script>

<template>
  <Teleport v-if="target" :to="target">
    <div class="VPNolebaseEnhancedReadabilitiesVoidZeroMenu">
      <NolebaseEnhancedReadabilitiesMenu />
    </div>
  </Teleport>
</template>

<style scoped>
.VPNolebaseEnhancedReadabilitiesVoidZeroMenu {
  display: flex;
  align-items: center;
  height: 2.375rem;
}

.VPNolebaseEnhancedReadabilitiesVoidZeroMenu :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout) {
  height: 2.375rem;
}

.VPNolebaseEnhancedReadabilitiesVoidZeroMenu :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout > .button) {
  height: 2.375rem;
  padding: 0 0.5rem;
  background: transparent;
  outline: none;
  scale: 1;
  box-shadow: none;
}

.VPNolebaseEnhancedReadabilitiesVoidZeroMenu :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout .text) {
  line-height: 2.375rem;
}
</style>
