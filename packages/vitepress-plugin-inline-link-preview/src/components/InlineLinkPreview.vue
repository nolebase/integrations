<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useElementHover, useMounted, useMouseInElement, useWindowSize, useMediaQuery } from '@vueuse/core'
import { defaultLinkPreviewPopupOptions, InjectionKey } from '../constants'
import { useInIframe } from '../composables/iframe'
import PopupIframe from './PopupIframe.vue'

const props = defineProps < {
  href: string
}>()

const options = inject(InjectionKey, defaultLinkPreviewPopupOptions)

const anchorElement = ref<HTMLAnchorElement | null>(null)
const iframeWrapperElement = ref<HTMLDivElement | null>(null)
const popupWidth = computed(() => options.popupWidth || defaultLinkPreviewPopupOptions.popupWidth || 600)
const popupHeight = computed(() => options.popupHeight || defaultLinkPreviewPopupOptions.popupHeight || 480)
const popupTeleportTargetSelector = computed(() => options.popupTeleportTargetSelector || defaultLinkPreviewPopupOptions.popupTeleportTargetSelector || 'body')

const mounted = useMounted()
const { width: windowWidth, height: windowHeight } = useWindowSize()
const { livesInIframe } = useInIframe()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')

/** TODO: this is a bit dirty to combine both in element and hover, should have a better way to achieve this  */
const { isOutside: isOutsideAnchorElement } = useMouseInElement(anchorElement)
const { isOutside: isOutsideIframeWrapperElement } = useMouseInElement(iframeWrapperElement)
const hoverOverAnchorElement = useElementHover(anchorElement)
const hoverOverIframeWrapperElement = useElementHover(iframeWrapperElement)

const popupCoordinatesX = ref(0)
const popupCoordinatesY = ref(0)
const hovering = ref(false)

const isHeadingAnchor = computed<boolean>(() => {
  return props.href.startsWith('#')
})

const hrefHost = computed<string>(() => {
  if (isHeadingAnchor.value) return ''

  try {
    return new URL(props.href, window.location.href).host
  }
  catch (e) {
    return ''
  }
})

const isOneOfPreviewHosts = computed<boolean>(() => {
  if (!window || !window.location)
    return false
  if (!hrefHost.value)
    return false
  if (options.previewAllHostNames) {
    return true
  }

  let previewLocalHostName = options.previewLocalHostName === undefined ?
    defaultLinkPreviewPopupOptions.previewLocalHostName :
    options.previewLocalHostName

  if (previewLocalHostName) {
    return window.location.host === hrefHost.value
  }
  if (typeof options.handleShouldPreviewHostNames === 'function') {
    return options.handleShouldPreviewHostNames(hrefHost.value)
  }
  if (Array.isArray(options.previewHostNamesBlocked) && options.previewHostNamesBlocked.includes(hrefHost.value)) {
    return false
  }
  if (Array.isArray(options.previewHostNamesAllowed) && options.previewHostNamesAllowed.includes(hrefHost.value)) {
    return true
  }

  return false
})

const showIframe = computed<boolean>(() => !livesInIframe.value && isOneOfPreviewHosts.value && hovering.value)

function watchHandler(val: boolean) {
  if (!val) {
    if (!anchorElement.value) return

    hovering.value = true

    const { x, y, right, height, width, bottom } = anchorElement.value.getBoundingClientRect()

    const hasFreeSpaceOnTheRight = right + popupWidth.value < windowWidth.value
    if (hasFreeSpaceOnTheRight)
      popupCoordinatesX.value = x + window.scrollX
    else
      popupCoordinatesX.value = x + window.scrollX - popupWidth.value + width

    const hasFreeSpaceBelow = bottom + popupHeight.value < windowHeight.value
    if (hasFreeSpaceBelow)
      popupCoordinatesY.value = y + window.scrollY + height + 4
    else
      popupCoordinatesY.value = y + window.scrollY - popupHeight.value - 4
  }

  if (val) {
    setTimeout(() => {
      if (isOutsideAnchorElement.value &&
        !hoverOverAnchorElement.value &&
        isOutsideIframeWrapperElement.value &&
        !hoverOverIframeWrapperElement.value) {
        hovering.value = false
      }
    }, 200)
  }
}

watch(isOutsideAnchorElement, watchHandler)
watch(hoverOverAnchorElement, (val) => watchHandler(!val))
watch(isOutsideIframeWrapperElement, watchHandler)
watch(hoverOverIframeWrapperElement, (val) => watchHandler(!val))
</script>

<template>
  <a
    ref="anchorElement"
    class="VPNolebaseInlinePreviewLink" relative
    :href="props.href"
  >
    <slot />
    <span
      v-if="mounted && !isHeadingAnchor && !isOneOfPreviewHosts"
      class="link-preview-link-content-external-icon" align-middle mx-0.5 w-4 h-4
      i-octicon:link-external-16
    />
    <template v-if="mounted && isLargerThanMobile">
      <Teleport :to="popupTeleportTargetSelector">
        <TransitionGroup name="fade">
          <div
            v-if="mounted && showIframe"
            ref="iframeWrapperElement"
            flex="~ col"
            absolute top-0 z-100 m-0 overflow-hidden rounded-lg p-0
            border="1 solid $vp-c-divider"
            class="VPNolebaseInlinePreviewLinkWrapper max-w-[100vw]"
            :style="{
              left: `${popupCoordinatesX}px`,
              top: `${popupCoordinatesY}px`,
              width: `${popupWidth}px`,
              height: `${popupHeight}px`,
            }"
            shadow="2xl"
          >
            <PopupIframe :href="props.href" />
          </div>
        </TransitionGroup>
      </Teleport>
    </template>
  </a>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
