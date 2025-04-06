<script setup lang="ts">
import { UnLazyImage } from '@unlazy/vue/components'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  thumbhash: string
  placeholderSrc: string
  width: string
  height: string
  autoSizes?: string
}>(), {
  autoSizes: 'true',
})

const isLoaded = ref(false)

function onLoaded() {
  isLoaded.value = true
}
</script>

<template>
  <Transition leave-active-class="animate-fade-out animate-duration-750 animate-ease-in-out">
    <img
      v-if="!isLoaded"
      class="nolebase-enhanced-img absolute inset-0 z-1 bg-black/10"
      :src="props.placeholderSrc"
      :width="props.width"
      :height="props.height"
      :style="{
        aspectRatio: `${props.width} / ${props.height}`,
      }"
    >
  </Transition>
  <UnLazyImage
    :src="props.src"
    :alt="props.alt"
    :thumbhash="props.thumbhash"
    :placeholder-src="props.placeholderSrc"
    :width="props.width"
    :height="props.height"
    :style="{
      aspectRatio: `${props.width} / ${props.height}`,
    }"
    @loaded="onLoaded"
  />
</template>

<style>
.vp-doc div p:has(> img.nolebase-enhanced-img) {
  position: relative;
}
</style>
