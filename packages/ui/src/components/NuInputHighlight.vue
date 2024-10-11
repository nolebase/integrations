<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <div
    class="input-highlight"
    transition="outline duration-200 ease"
    :class="{
      active: Boolean(active),
    }"
  >
    <slot />
  </div>
</template>

<style lang="css" scoped>
.input-highlight {
  outline-width: 2px;
  outline-color: transparent;
  outline-offset: 4px;
  outline-style: dashed;
}

.input-highlight.active {
  outline-color: var(--vp-c-brand-1);
}
</style>
