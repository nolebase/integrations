<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementBounding, useMounted, useMouseInElement } from '@vueuse/core'

const helpElementRef = ref<HTMLSpanElement>()

const mounted = useMounted()
const { isOutside } = useMouseInElement(helpElementRef)

const bounding = useElementBounding(helpElementRef)

const helpPopupStyle = computed(() => {
  return {
    top: `${bounding.top.value}px`,
    left: `${bounding.left.value + bounding.width.value + 8}px`,
  }
})
</script>

<template>
  <span
    ref="helpElementRef"
    text="$vp-c-text-1"
    class="i-carbon:help-filled opacity-50 hover:opacity-100"
    transition="all duration-200 ease"
  />
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="mounted"
        v-show="!isOutside"
        :style="helpPopupStyle"
        fixed z-100 bg="white dark:zinc-800" text="dark:zinc-100" rounded-lg p-3 shadow-lg border="1 solid zinc-200 dark:zinc-700"
        pointer-events-none
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
