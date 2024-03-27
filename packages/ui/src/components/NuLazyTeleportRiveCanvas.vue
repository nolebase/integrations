<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { Rive } from '@rive-app/canvas'

const route = useRoute()
const riveInstances = ref<Rive[]>([])

const defaultCreateCanvasOptions = {
  canvasWidth: 500,
  canvasHeight: 500,
  width: '16px',
  height: '16px',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '4px',
  paddingRight: '4px',
}

interface CreateCanvasOptions {
  canvasWidth: number
  canvasHeight: number
  width: string
  height: string
  paddingTop: string
  paddingBottom: string
  paddingLeft: string
  paddingRight: string
}

function cleanupAllRiveInstances() {
  for (const rive of riveInstances.value) {
    try {
      rive.cleanup()
    }
    catch (e) {
    }
  }

  riveInstances.value = []
}

function mustParseIntOrDefault(value: string | null, defaultValue: number): number {
  if (!value)
    return defaultValue

  const numberValue = Number.parseInt(value, 10)
  if (Number.isNaN(numberValue))
    return defaultValue

  return numberValue
}

function getOptionsFromAttrs(node?: Element): CreateCanvasOptions {
  if (!node)
    return defaultCreateCanvasOptions

  const dataAttrPrefix = 'data-rive-canvas-props'

  const canvasWidth = node.getAttribute(`${dataAttrPrefix}-canvas-width`)
  defaultCreateCanvasOptions.canvasWidth = mustParseIntOrDefault(canvasWidth, defaultCreateCanvasOptions.canvasWidth)

  const canvasHeight = node.getAttribute(`${dataAttrPrefix}-canvas-height`)
  defaultCreateCanvasOptions.canvasHeight = mustParseIntOrDefault(canvasHeight, defaultCreateCanvasOptions.canvasHeight)

  const width = node.getAttribute(`${dataAttrPrefix}-width`)
  width && (defaultCreateCanvasOptions.width = width)

  const height = node.getAttribute(`${dataAttrPrefix}-height`)
  height && (defaultCreateCanvasOptions.height = height)

  const paddingTop = node.getAttribute(`${dataAttrPrefix}-padding-top`)
  paddingTop && (defaultCreateCanvasOptions.paddingTop = paddingTop)

  const paddingBottom = node.getAttribute(`${dataAttrPrefix}-padding-bottom`)
  paddingBottom && (defaultCreateCanvasOptions.paddingBottom = paddingBottom)

  const paddingLeft = node.getAttribute(`${dataAttrPrefix}-padding-left`)
  paddingLeft && (defaultCreateCanvasOptions.paddingLeft = paddingLeft)

  const paddingRight = node.getAttribute(`${dataAttrPrefix}-padding-right`)
  paddingRight && (defaultCreateCanvasOptions.paddingRight = paddingRight)

  return defaultCreateCanvasOptions
}

function createNewCanvasElement(options: CreateCanvasOptions) {
  const canvas = document.createElement('canvas')

  canvas.width = options.canvasWidth
  canvas.height = options.canvasHeight
  canvas.style.cssText = ''
  + `padding-top: ${options.paddingTop};`
  + `padding-bottom: ${options.paddingBottom};`
  + `padding-left: ${options.paddingLeft};`
  + `padding-right: ${options.paddingRight};`
  + `min-width: ${options.width};`
  + `min-height: ${options.height};`
  + `width: 100%;`
  + `height: 100%;`

  return canvas
}

async function renderRiveAsset() {
  const elementsRaw = document.querySelectorAll('.rive-canvas[data-rive-canvas="true"]')
  if (!elementsRaw || !elementsRaw.length)
    return

  const elements = Array.from(elementsRaw)
  if (!elements.length)
    return

  for (const el of elements) {
    const src = el.attributes.getNamedItem('data-rive-src')
    if (!src) {
      console.error('No src attribute found')
      continue
    }

    for (const cel of Array.from(el.children))
      el.removeChild(cel)

    const options = getOptionsFromAttrs(el)
    const canvas = createNewCanvasElement(options)

    el.appendChild(canvas)

    const rive = await import('@rive-app/canvas')
    const r = new rive.Rive({
      canvas,
      src: src.value,
      autoplay: true,
    })

    riveInstances.value.push(r)
  }
}

onMounted(async () => {
  if (!window && !document)
    return

  await renderRiveAsset()
})

watch(route, async () => {
  if (!window && !document)
    return

  await nextTick()
  await renderRiveAsset()
})

onUnmounted(() => {
  if (!window && !document)
    return

  cleanupAllRiveInstances()
})
</script>

<template>
  <ClientOnly>
    <span invisible hidden opacity-0 />
  </ClientOnly>
</template>
