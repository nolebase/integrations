<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title?: string
  icon?: string
  disabled?: boolean
}>()
</script>

<template>
  <h3
    class="VPNolebaseEnhancedReadabilitiesMenuTitle"
    :class="{ disabled: !!props.disabled }"
    inline-flex items-center
    text="[14px] $vp-c-text-1" font-medium align-middle
    select-none
  >
    <span v-if="props.icon" :class="props.icon" mr-1 aria-hidden="true" />
    <span v-if="props.title">{{ props.title }}</span>
    <slot />
  </h3>
</template>

<style scoped less>
.VPNolebaseEnhancedReadabilitiesMenuTitle {
  &.disabled {
    opacity: 0.5;
  }
}
</style>
