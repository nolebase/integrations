<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()
const src = computed(() => isDark.value ? '/logo-dark.png' : '/logo-day.png')
</script>

<template>
  <img
    :src="src"
    class="VPImage image-src"
    alt="Hero Image"
  >
</template>
