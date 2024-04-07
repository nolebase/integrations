<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { lazyLoad } from 'unlazy'

const route = useRoute()

onMounted(() => {
  lazyLoad('img[loading="lazy"][data-src]')
})

watch(route, () => {
  lazyLoad('img[loading="lazy"][data-src]')
})
</script>

<template>
  <slot />
</template>
