<script setup lang="ts">
// import { computed } from 'vue'
// import { useData } from 'vitepress'

// const { isDark } = useData()
// const src = computed(() => isDark.value ? '/logo-dark.png' : '/logo-day.png')
</script>

<template>
  <img
    src="/logo-light.png"
    class="VPImage image-src block dark:hidden"
    alt="Hero Image"
  >
  <img
    src="/logo-dark.png"
    class="VPImage image-src hidden dark:block"
    alt="Hero Image"
  >
</template>
