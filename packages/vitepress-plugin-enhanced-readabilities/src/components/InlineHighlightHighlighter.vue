<script setup lang="ts">
import { ref, watch, reactive, Teleport, onMounted, inject } from 'vue'
import { useElementBounding, useElementByPoint, useEventListener, useMouseInElement, useElementVisibility, useMouse } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { InjectionKey } from '../constants'

const options = inject(InjectionKey, {})

const props = defineProps<{ enabled: boolean }>()

const boxStyles = ref<Record<string, string | number>>({ display: 'none' })
const vpDocElement = ref<HTMLDivElement>()
const highlightedElement = ref<HTMLElement>()

const { x, y } = useMouse({ type: 'client' })
const { isOutside } = useMouseInElement(vpDocElement)
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))
const elementVisibility = useElementVisibility(highlightedElement)
const route = useRoute()

useEventListener('scroll', bounding.update, true)

onMounted(() => {
  vpDocElement.value = document.querySelector('.VPDoc main .vp-doc') as HTMLDivElement
})

watch(route, () => {
  vpDocElement.value = document.querySelector('.VPDoc main .vp-doc') as HTMLDivElement
})

function computeBoxStyles(bounding: {
  height: number
  left: number
  top: number
  width: number
}) {
  return {
    display: 'block',
    width: `${bounding.width + 8}px`,
    height: `${bounding.height + 8}px`,
    left: `${bounding.left - 4}px`,
    top: `${bounding.top - 4}px`,
    backgroundColor: options?.inlineHighlightHoverBlockColor || 'rgb(240 197 52 / 10%)',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
  }
}

function findChildElementUnderVPDocElement(element: HTMLElement | null) {
  if (element === null) return null

  if (element.parentElement === document.querySelector('.VPDoc main .vp-doc > div')) return element
  else return findChildElementUnderVPDocElement(element.parentElement)
}

function watchHandler() {
  if (element.value && !isOutside.value) {
    const el = findChildElementUnderVPDocElement(element.value)
    highlightedElement.value = el || undefined

    if (highlightedElement.value && highlightedElement.value.tagName === 'P') {
      const val = highlightedElement.value
      const style = window.getComputedStyle(val)
      const lineHeight = parseFloat(style.lineHeight)
      const lines = Math.floor(val.offsetHeight / lineHeight)

      const rect = val.getBoundingClientRect()
      const relativeY = y.value - rect.top

      for (let i = 0; i < lines; i++) {
        const top = i * lineHeight
        const height = lineHeight
        const left = val.offsetLeft
        const width = val.offsetWidth

        if (relativeY >= top && relativeY < top + height) {
          boxStyles.value = computeBoxStyles({
            top: top + rect.top,
            left: left + rect.left,
            width,
            height
          })
          break
        }
      }
    } else {
      if (highlightedElement.value) {
        const rect = highlightedElement.value.getBoundingClientRect()

        boxStyles.value = computeBoxStyles({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
      }
    }
  }
}

watch([x, y], () => {
  if (props.enabled) watchHandler()
})

watch(bounding, (val) => {
  if (props.enabled) {
    if (val.width === 0 && val.height === 0) boxStyles.value = { display: 'none' }
    else watchHandler()
  }
})

watch(elementVisibility, (val) => {
  if (props.enabled) {
    if (!val) boxStyles.value = { display: 'none' }
  }
})

watch(() => props.enabled, (val) => {
  if (!val) boxStyles.value = { display: 'none' }
})
</script>

<template>
  <Teleport to="body">
    <div
      :style="boxStyles"
      aria-hidden="true"
      focusable="false"
      fixed z-50
      pointer-events-none
      border="1 $vp-c-brand"
      class="VPNolebaseInlineHighlighter"
    />
  </Teleport>
</template>
