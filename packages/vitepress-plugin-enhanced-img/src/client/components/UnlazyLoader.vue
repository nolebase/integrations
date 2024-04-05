<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { lazyLoad } from 'unlazy'

const route = useRoute()

onMounted(() => {
  lazyLoad()
})

watch(route, () => {
  lazyLoad()
})
</script>

<template>
  <slot />
</template>
