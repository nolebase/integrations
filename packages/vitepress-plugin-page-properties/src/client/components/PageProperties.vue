<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div my-4>
    <div class="grid grid-cols-[80px_auto] gap-y-2">
      <template v-for="(value, key) in frontmatter" :key="key">
        <div>
          <span>{{ key }}</span>
        </div>
        <div>
          <span>{{ value }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
