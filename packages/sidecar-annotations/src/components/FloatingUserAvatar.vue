<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<template>
  <img
    class="sidecar-annotations-comments user-avatar"
    :src="props.src"
    w-5 h-5 rounded-full max-w-none p-0.5
    bg="white dark:zinc-600"
  shadow-md
  />
</template>
