<script setup lang="ts">
import { ref, Teleport, onMounted, computed, watchEffect } from 'vue'

import CommentAnnotationItem from './CommentAnnotationItem.vue'

const vpDocElement = ref<HTMLDivElement>()

onMounted(() => {
  vpDocElement.value = document.querySelector('.VPDoc .container .content .content-container main .vp-doc > div') as HTMLDivElement
})

const elements = computed<HTMLElement[]>(() => {
  if (vpDocElement.value?.children) {
    return Array.
      from(vpDocElement.value?.children).
      filter(element => ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(element.tagName) === -1).
      map((element) => element as HTMLElement)
  }

  return [] as HTMLElement[]
})

watchEffect(() => {
  console.log(elements.value)
})
</script>

<template>
  <Teleport to="body">
    <div class="sidecar-annotations-comments-teleport-container">
      <CommentAnnotationItem v-for="(element, index) of elements || []" :key="index" :element="element" />
    </div>
  </Teleport>
</template>
