<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'

function handleHighlight() {
  if (!window || !window.location)
    return
  if (!window.location.hash)
    return

  const targetedHashId = decodeURIComponent(window.location.hash)
  if (!targetedHashId)
    return

  let elem: HTMLElement | null

  try {
    elem = document.querySelector(targetedHashId)
  }
  catch (e) {
    console.error(e)
    return
  }
  if (!elem)
    return

  if (!elem.classList.contains('VPNolebaseHighlightTargetedHeading'))
    elem.classList.add('VPNolebaseHighlightTargetedHeading')

  elem.classList.remove('VPNolebaseHighlightTargetedHeadingAnimated')
  setTimeout(() => {
    if (elem)
      elem.classList.add('VPNolebaseHighlightTargetedHeadingAnimated')
  }, 10)
}

const route = useRoute()

onMounted(handleHighlight)

watch(route, async () => {
  await nextTick()
  handleHighlight()
})

useEventListener('hashchange', handleHighlight)
</script>

<template>
  <slot />
</template>

<style>
:root {
  --vp-nolebase-highlight-targeted-heading-color: var(--vp-custom-block-tip-text);
  --vp-nolebase-highlight-targeted-heading-bg: var(--vp-custom-block-tip-bg);
}

@keyframes vp-nolebase-highlight-targeted-heading-animation {
  0% {
    background-color: transparent;
    box-shadow: 0px 0px 0px 8px transparent;
  }
  10%, 35% {
    color: var(--vp-nolebase-highlight-targeted-heading-color);
    border-color: transparent;
    border-radius: 4px;
    background-color: var(--vp-nolebase-highlight-targeted-heading-bg);
    box-shadow: 0px 0px 0px 8px var(--vp-nolebase-highlight-targeted-heading-bg);
  }
  99% {
    background-color: transparent;
    border-radius: 4px;
    box-shadow: 0px 0px 0px 8px transparent;
  }
  100% {
    border-radius: 0px;
    background-color: transparent;
    box-shadow: none;
  }
}

.VPNolebaseHighlightTargetedHeadingAnimated {
  animation: vp-nolebase-highlight-targeted-heading-animation 1.5s ease-in-out;
}
</style>
