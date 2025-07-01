<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { computed, inject, onMounted, ref, watch } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'
import SpotlightHoverBlock from './SpotlightHoverBlock.vue'

import { useI18n } from '../composables/i18n'
import { InjectionKey, SpotlightToggledStorageKey } from '../constants'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isTouchScreen = useMediaQuery('(pointer: coarse)')
const spotlightToggledOn = useStorage(SpotlightToggledStorageKey, options.spotlight?.defaultToggle || false)
const { t } = useI18n()

const fieldOptions = computed(() => [
  {
    value: true,
    title: t('spotlight.optionOn'),
    ariaLabel: t('spotlight.optionOnAriaLabel'),
    text: 'ON',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch',
  },
  {
    value: false,
    title: t('spotlight.optionOff'),
    ariaLabel: t('spotlight.optionOffAriaLabel'),
    text: 'OFF',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch',
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
  <div space-y-2 role="radiogroup">
    <SpotlightHoverBlock
      v-if="mounted && spotlightToggledOn && !disabled"
      :enabled="spotlightToggledOn && !disabled"
    />
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle
        :title="t('spotlight.title')"
        :aria-label="t('spotlight.titleAriaLabel') || t('spotlight.title')"
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
          {{ t('spotlight.title') }}
        </h4>
        <p text="sm" mb-2 max-w-100>
          <span>{{ t('spotlight.titleHelpMessage') }}</span>
        </p>
        <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-2>
              <span mr-1 font-bold>ON</span>
              <span font-semibold>{{ t('spotlight.optionOn') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOnHelpMessage') }}</span>
          </div>
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-2>
              <span mr-1 font-bold>OFF</span>
              <span font-semibold>{{ t('spotlight.optionOff') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOffHelpMessage') }}</span>
          </div>
        </div>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="spotlightToggledOn"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
        :disabled="disabled"
      />
    </NuInputHighlight>
  </div>
</template>
