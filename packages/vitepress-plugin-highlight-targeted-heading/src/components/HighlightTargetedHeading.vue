<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { onMounted } from 'vue'

onMounted(() => {
  if (!window.location.hash)
    return

  const targetedHashId = decodeURIComponent(window.location.hash)

  const elem = document.querySelector(targetedHashId)
  if (!elem)
    return

  if (!elem.classList.contains('VPNolebaseHighlightTargetedHeading'))
    elem.classList.add('VPNolebaseHighlightTargetedHeading')

  elem.classList.remove('VPNolebaseHighlightTargetedHeadingAnimated')
  setTimeout(() => {
    elem.classList.add('VPNolebaseHighlightTargetedHeadingAnimated')
  }, 10)
})

useEventListener('hashchange', () => {
  if (!window.location.hash)
    return

  const targetedHashId = decodeURIComponent(window.location.hash)

  const elem = document.querySelector(targetedHashId)
  if (!elem)
    return

  if (!elem.classList.contains('VPNolebaseHighlightTargetedHeading'))
    elem.classList.add('VPNolebaseHighlightTargetedHeading')

  elem.classList.remove('VPNolebaseHighlightTargetedHeadingAnimated')
  setTimeout(() => {
    elem.classList.add('VPNolebaseHighlightTargetedHeadingAnimated')
  }, 10)
})
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
