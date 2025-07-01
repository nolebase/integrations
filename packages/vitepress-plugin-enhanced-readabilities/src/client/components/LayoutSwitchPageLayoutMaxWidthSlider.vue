<script setup lang="ts">
import { NuInputHighlight, NuInputSlider, NuVerticalTransition } from '@nolebase/ui'
import { useDebounceFn, useLocalStorage, useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { computed, inject, onMounted, ref, watch } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { useLayoutAppearanceChangeAnimation } from '../composables/animation'
import { useI18n } from '../composables/i18n'
import { InjectionKey, LayoutMode, LayoutSwitchModeStorageKey, PageLayoutMaxWidthStorageKey } from '../constants'

const min = ref(60)
const minScaled = computed(() => min.value * 100)

const max = ref(100)
const maxScaled = computed(() => max.value * 100)

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const shouldActivateMaxWidth = useMediaQuery('(min-width: 1440px)')
const maxWidthLocalStorageValue = useStorage(PageLayoutMaxWidthStorageKey, (options.layoutSwitch?.pageLayoutMaxWidth?.defaultMaxWidth || 100) * 100)
const layoutMode = useLocalStorage<LayoutMode>(LayoutSwitchModeStorageKey, options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable)

const maxWidthValue = computed({
  get: () => {
    const parsedMaxWidth = Number.parseInt(String(maxWidthLocalStorageValue.value))

    if (Number.isNaN(parsedMaxWidth))
      return maxScaled.value

    if (parsedMaxWidth < minScaled.value)
      return minScaled.value

    if (parsedMaxWidth > maxScaled.value)
      return maxScaled.value

    return parsedMaxWidth
  },
  set: (val) => {
    if (val < minScaled.value)
      val = minScaled.value

    if (val > maxScaled.value)
      val = maxScaled.value

    maxWidthLocalStorageValue.value = val
  },
})

const { t } = useI18n()
const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

const updatePageMaxWidth = useDebounceFn((val: number) => {
  if (!shouldActivateMaxWidth.value) {
    document.body.style.setProperty('--vp-nolebase-enhanced-readabilities-page-max-width', `100%`)
  }
  else {
    if (!options.layoutSwitch?.pageLayoutMaxWidth?.disableAnimation)
      triggerAnimation(document.body)
    document.body.style.setProperty('--vp-nolebase-enhanced-readabilities-page-max-width', `${Math.ceil(val / 100)}%`)
  }
}, 1000)

watch(mounted, (val) => {
  if (!val)
    return

  updatePageMaxWidth(maxWidthValue.value)
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value)
    disabled.value = true
})

watch(shouldActivateMaxWidth, () => {
  updatePageMaxWidth(maxWidthValue.value)
})

onMounted(() => {
  if (!isLargerThanMobile.value)
    disabled.value = true
})

watch(maxWidthValue, (val) => {
  if (!mounted.value)
    return

  updatePageMaxWidth(val)
})
</script>

<template>
  <NuVerticalTransition :duration="200">
    <div
      v-show="layoutMode === LayoutMode.SidebarWidthAdjustableOnly || layoutMode === LayoutMode.BothWidthAdjustable"
      space-y-2
      role="range"
    >
      <div ref="menuTitleElementRef" flex items-center>
        <MenuTitle
          :title="t('layoutSwitch.pageLayoutMaxWidth.title')"
          :aria-label="t('layoutSwitch.pageLayoutMaxWidth.titleAriaLabel') || t('layoutSwitch.pageLayoutMaxWidth.title')"
          :disabled="disabled"
          flex="1"
          pr-2
        >
          <template #icon>
            <span i-icon-park-outline:auto-width-one mr-1 aria-hidden="true" />
          </template>
        </MenuTitle>
        <MenuHelp
          v-if="!options.layoutSwitch?.pageLayoutMaxWidth?.disableHelp"
          v-model:is-popped-up="isMenuHelpPoppedUp"
          :menu-title-element-ref="menuTitleElementRef"
        >
          <h4 text-md mb-1 font-semibold>
            {{ t('layoutSwitch.pageLayoutMaxWidth.title') }}
          </h4>
          <p text="sm" mb-2 max-w-100>
            <span>{{ t('layoutSwitch.pageLayoutMaxWidth.titleHelpMessage') }}</span>
          </p>
          <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
            <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
              <h5 text="sm" mb-2 flex="~" items-center align-middle>
                <span i-icon-park-outline:scale mr-1 />
                <span font-semibold>{{ t('layoutSwitch.pageLayoutMaxWidth.slider') }}</span>
              </h5>
              <span>{{ t('layoutSwitch.pageLayoutMaxWidth.sliderHelpMessage') }}</span>
            </div>
          </div>
        </MenuHelp>
      </div>
      <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
        <NuInputSlider
          v-model="maxWidthValue"
          bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
          text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
          name="VitePress Nolebase Enhanced Readabilities page layout max width range slider"
          :aria-label="t('layoutSwitch.pageLayoutMaxWidth.sliderAriaLabel')"
          :disabled="disabled"
          :min="minScaled"
          :max="maxScaled"
          :formatter="(val) => `${Math.ceil(val / 100)}%`"
        />
      </NuInputHighlight>
    </div>
  </NuVerticalTransition>
</template>
