<script setup lang="ts">
function onBeforeEnter(el: Element) {
  const divEl = el as HTMLDivElement

  divEl.style.height = '0px'
}

function onEnter(el: Element) {
  const divEl = el as HTMLDivElement

  divEl.style.height = `${divEl.scrollHeight}px`
  divEl.style.overflow = 'hidden'
}

function onAfterEnter(el: Element) {
  const divEl = el as HTMLDivElement

  divEl.style.height = `${divEl.scrollHeight}px`
}

function onBeforeLeave(el: Element) {
  const divEl = el as HTMLDivElement

  divEl.style.height = `${divEl.scrollHeight}px`
  divEl.style.overflow = 'hidden'
}

function onLeave(el: Element) {
  const divEl = el as HTMLDivElement

  if (divEl.scrollHeight !== 0)
    divEl.style.height = '0px'
}

function onAfterLeave(el: Element) {
  const divEl = el as HTMLDivElement

  divEl.style.transition = ''
}
</script>

<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>
