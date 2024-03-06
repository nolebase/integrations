<script setup lang="ts">
import { onMounted } from 'vue'
import { Rive } from '@rive-app/canvas'

onMounted(() => {
  if (!window && !document)
    return

  const elementsRaw = document.querySelectorAll('.rive-canvas[data-rive-canvas="true"]')
  const elements = Array.from(elementsRaw)

  for (const el of elements) {
    const src = el.attributes.getNamedItem('data-rive-src')
    if (!src)
      return

    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 500
    canvas.style.cssText = 'padding: 4px 4px; min-width: 16px; min-height: 16px; width: 100%; height: 100%;'

    for (const cel of Array.from(el.children))
      el.removeChild(cel)

    el.appendChild(canvas)

    // eslint-disable-next-line no-new
    new Rive({
      canvas,
      src: src.value,
      autoplay: true,
    })
  }
})
</script>

<template>
  <ClientOnly>
    <span />
  </ClientOnly>
</template>
