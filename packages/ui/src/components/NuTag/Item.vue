<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

function hasSlot(name: 'pre' | 'post') {
  return !!slots[name]
}
</script>

<template>
  <div
    class="vp-nolebase-page-property"
    data-page-property="value"
    data-page-property-type="tags"
    transition="all ease-in-out"
    bg="zinc-200 dark:zinc-700"
    rounded="md"
    px="2 <sm:1.5" py="0.5"
    inline-block flex-inline cursor-help select-none items-center justify-center duration-200
    :class="[hasSlot('pre') || hasSlot('post') ? '' : 'hover:bg-zinc-300 active:bg-zinc-400 dark:hover:bg-zinc-600 dark:active:bg-zinc-700']"
  >
    <div flex items-center justify-center space-x-1>
      <slot name="pre" />
      <slot />
      <slot name="post" />
    </div>
  </div>
</template>
