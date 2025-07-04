<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useMediaQuery, useStorage } from '@vueuse/core'
import { computed, inject, onMounted, ref, watch } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { useI18n } from '../composables/i18n'
import { InjectionKey, SpotlightStyle, SpotlightStylesStorageKey, SpotlightToggledStorageKey } from '../constants'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const isTouchScreen = useMediaQuery('(pointer: coarse)')
const spotlightToggledOn = useStorage(SpotlightToggledStorageKey, options.spotlight?.defaultToggle || false)
const spotlightStyle = useStorage<SpotlightStyle>(SpotlightStylesStorageKey, options.spotlight?.defaultStyle || SpotlightStyle.Aside)
const { t } = useI18n()

const fieldOptions = computed(() => [
  {
    value: SpotlightStyle.Under,
    title: t('spotlight.styles.optionUnder'),
    ariaLabel: t('spotlight.styles.optionUnderAriaLabel'),
    icon: 'i-icon-park-outline:align-text-left-one',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Style Checkbox',
  },
  {
    value: SpotlightStyle.Aside,
    title: t('spotlight.styles.optionAside'),
    ariaLabel: t('spotlight.styles.optionAsideAriaLabel'),
    icon: 'i-icon-park-outline:align-left-one',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Style Checkbox',
  },
])

onMounted(() => {
  disabled.value = isTouchScreen.value
})

watch(isTouchScreen, () => {
  disabled.value = isTouchScreen.value
})
</script>

<template>
  <Transition name="fade-shift">
    <div
      v-if="spotlightToggledOn"
      space-y-2
      role="radiogroup"
      class="VPNolebaseEnhancedReadabilitiesSpotlightStyles"
    >
      <div ref="menuTitleElementRef" relative flex items-center>
        <MenuTitle
          :title="t('spotlight.styles.title')"
          :aria-label="t('spotlight.styles.titleAriaLabel') || t('spotlight.styles.title')"
          :disabled="disabled"
          flex="1"
          pr-4
        >
          <template #icon>
            <span i-icon-park-outline:click mr-1 aria-hidden="true" />
          </template>
        </MenuTitle>
        <MenuHelp
          v-if="!options.spotlight?.disableHelp"
          v-model:is-popped-up="isMenuHelpPoppedUp"
          :menu-title-element-ref="menuTitleElementRef"
        >
          <h4 text-md mb-1 font-semibold>
            {{ t('spotlight.styles.title') }}
          </h4>
          <p text="sm" mb-2 max-w-100>
            <span>{{ t('spotlight.styles.titleHelpMessage') }}</span>
          </p>
          <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
            <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
              <h5 text="sm" mb-2>
                <span i-icon-park-outline:align-text-left-one mr-1 />
                <span font-semibold>{{ t('spotlight.styles.optionUnder') }}</span>
              </h5>
              <span>{{ t('spotlight.styles.optionUnderHelpMessage') }}</span>
            </div>
            <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
              <h5 text="sm" mb-2>
                <span i-icon-park-outline:align-left-one mr-1 />
                <span font-semibold>{{ t('spotlight.styles.optionAside') }}</span>
              </h5>
              <span>{{ t('spotlight.styles.optionAsideHelpMessage') }}</span>
            </div>
          </div>
        </MenuHelp>
      </div>
      <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
        <NuInputHorizontalRadioGroup
          v-model="spotlightStyle"
          bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
          text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
          :options="fieldOptions"
          :disabled="disabled"
        />
      </NuInputHighlight>
    </div>
  </Transition>
</template>

<style scoped>
.VPNolebaseEnhancedReadabilitiesSpotlightStyles {
  max-height: 100px;
  height: 100%;
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
