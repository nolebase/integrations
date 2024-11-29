<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()

const breadcrumbs = (frontmatter.value.breadcrumbs ?? []) as {
  title: string
  link: string
}[]
</script>

<template>
  <div class="breadcrumbs">
    <span v-for="item in breadcrumbs" :key="item">
      <a :href="item.link">{{ item.title }}</a>
    </span>
  </div>
</template>

<style scoped>
.breadcrumbs {
  font-size: 14px;
  margin-bottom: 2rem;
}

.breadcrumbs span {
  transition: color 0.25s, opacity 0.25s;
  color: var(--vp-c-text-2);
}

.breadcrumbs span:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumbs span:last-child {
  color: var(--vp-c-text-1);
}

.breadcrumbs span:last-child:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumbs span:not(:first-child)::before {
  content: "/";
  padding-left: 4px;
  padding-right: 4px;
  color: var(--vp-c-text-3);
}
</style>
