<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useDebounceFn, useLocalStorage, useMediaQuery, useMounted, useStorage } from '@vueuse/core'

import { InjectionKey, ContentLayoutMaxWidthStorageKey, LayoutSwitchModeStorageKey, LayoutMode } from '../constants'
import { useLayoutAppearanceChangeAnimation } from '../composables/animation'
import { useI18n } from '../composables/i18n'

import MenuTitle from './MenuTitle.vue'
import MenuHelp from './MenuHelp.vue'
import MenuRange from './MenuSlider.vue'

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
const maxWidthLocalStorageValue = useStorage(ContentLayoutMaxWidthStorageKey, (options.layoutSwitch?.contentLayoutMaxWidth?.defaultMaxWidth || 80) * 100)
const layoutMode = useLocalStorage(LayoutSwitchModeStorageKey, options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable)

const maxWidthValue = computed({
  get: () => {
    const parsedMaxWidth = parseInt(String(maxWidthLocalStorageValue.value))

    if (Number.isNaN(parsedMaxWidth)) {
      return maxScaled.value
    }
    if (parsedMaxWidth < minScaled.value) {
      return minScaled.value
    }
    if (parsedMaxWidth > maxScaled.value) {
      return maxScaled.value
    }

    return parsedMaxWidth
  },
  set: (val) => {
    if (val < minScaled.value) {
      val = minScaled.value
    }
    if (val > maxScaled.value) {
      val = maxScaled.value
    }

    maxWidthLocalStorageValue.value = val
  }
})

const { t } = useI18n()
const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

const updatePageMaxWidth = useDebounceFn((val: number) => {
  if (!shouldActivateMaxWidth.value) {
    document.body.style.setProperty('--vp-nolebase-enhanced-readabilities-content-max-width', `100%`)
  } else {
    triggerAnimation(document.body)
    document.body.style.setProperty('--vp-nolebase-enhanced-readabilities-content-max-width', `${Math.ceil(val/100)}%`)
  }
}, 1000)

watch(mounted, (val) => {
  if (!val)
    return

  updatePageMaxWidth(maxWidthValue.value)
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    disabled.value = true
  }
})

watch(shouldActivateMaxWidth, () => {
  updatePageMaxWidth(maxWidthValue.value)
})

onMounted(() => {
  if (!isLargerThanMobile.value) {
    disabled.value = true
  }
})

watch(maxWidthValue, (val) => {
  if (!mounted.value)
    return

  updatePageMaxWidth(val)
})
</script>

<template>
  <Transition name="fade-shift">
    <div space-y-2 role="range" v-if="layoutMode === LayoutMode.BothWidthAdjustable" class="VPNolebaseEnhancedReadabilitiesContentLayoutWidthSlider">
      <div flex items-center ref="menuTitleElementRef">
        <MenuTitle
          icon="i-icon-park-outline:auto-line-width"
          :title="t('layoutSwitch.contentLayoutMaxWidth.title')"
          :aria-label="t('layoutSwitch.contentLayoutMaxWidth.titleArialLabel') || t('layoutSwitch.contentLayoutMaxWidth.title')"
          :disabled="disabled"
          flex="1"
          pr-4
        />
        <MenuHelp
          v-if="!options.layoutSwitch?.contentLayoutMaxWidth?.disableHelp"
          :menu-title-element-ref="menuTitleElementRef"
          v-model:is-popped-up="isMenuHelpPoppedUp"
        >
          <h4 text-md font-semibold mb-1>
            {{ t('layoutSwitch.contentLayoutMaxWidth.title') }}
          </h4>
          <p max-w-100 text="sm" mb-2>
            <span>{{ t('layoutSwitch.contentLayoutMaxWidth.titleHelpMessage') }}</span>
          </p>
          <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
            <p max-w-100 text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" p-3 rounded-xl>
              <h5 text="sm" mb-1 flex="~" items-center align-middle>
                <span i-icon-park-outline:scale mr-1 />
                <span>{{ t('layoutSwitch.contentLayoutMaxWidth.slider') }}</span>
              </h5>
              <span>{{ t('layoutSwitch.contentLayoutMaxWidth.sliderHelpMessage') }}</span>
            </p>
          </div>
        </MenuHelp>
      </div>
      <fieldset
        flex="~ row"
        space-x-2 w-full p-1
        appearance-none
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        rounded-lg border-none
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        outline="transparent 2px offset-4px dashed"
        transition="outline duration-200 ease"
        :class="{
          'outline-$vp-c-brand-1!': isMenuHelpPoppedUp,
          'rounded-md': isMenuHelpPoppedUp
        }"
      >
        <MenuRange
          v-model="maxWidthValue"
          name="VitePress Nolebase Enhanced Readabilities content layout max width range slider"
          :aria-label="t('layoutSwitch.contentLayoutMaxWidth.optionFullWidthAriaLabel')"
          :disabled="disabled"
          :min="minScaled"
          :max="maxScaled"
          :formatter="(val) => `${Math.ceil(val/100)}%`"
        />
      </fieldset>
    </div>
  </Transition>
</template>

<style scoped>
.VPNolebaseEnhancedReadabilitiesContentLayoutWidthSlider {
  max-height: 100px;
}

.fade-shift-enter-active,
.fade-shift-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.2s ease-in-out;
}

.fade-shift-enter-from,
.fade-shift-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
</style>
