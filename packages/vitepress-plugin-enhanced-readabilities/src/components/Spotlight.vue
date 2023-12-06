<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import { InjectionKey, SpotlightToggledStorageKey } from '../constants'
import SpotlightHoverBlock from './SpotlightHoverBlock.vue'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import MenuHelp from './MenuHelp.vue'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isTouchScreen = useMediaQuery('(pointer: coarse)')
const spotlightToggledOn = useStorage(SpotlightToggledStorageKey, options.spotlight?.defaultToggle || false)
const { t } = useI18n()

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
        icon="i-icon-park-outline:click"
        :title="t('spotlight.title')"
        :aria-label="t('spotlight.titleArialLabel') || t('spotlight.title')"
        :disabled="disabled"
        flex="1"
        pr-4
      />
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
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>ON</span>
              <span>{{ t('spotlight.optionOn') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOnHelpMessage') }}</span>
          </div>
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>OFF</span>
              <span>{{ t('spotlight.optionOff') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOffHelpMessage') }}</span>
          </div>
        </div>
      </MenuHelp>
    </div>
    <fieldset
      flex="~ row"

      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      w-full appearance-none rounded-lg border-none p-1 space-x-2
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      outline="transparent 2px offset-4px dashed"
      transition="outline duration-200 ease"
      :class="{
        'outline-$vp-c-brand-1!': isMenuHelpPoppedUp,
        'rounded-md': isMenuHelpPoppedUp,
      }"
    >
      <MenuOption
        v-model="spotlightToggledOn"
        :title="t('spotlight.optionOn')"
        :aria-label="t('spotlight.optionOnAriaLabel')"
        :value="true"
        :disabled="disabled"
        text="ON"
        name="VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch"
      />
      <MenuOption
        v-model="spotlightToggledOn"
        :title="t('spotlight.optionOff')"
        :aria-label="t('spotlight.optionOffAriaLabel')"
        :value="false"
        :disabled="disabled"
        text="OFF"
        name="VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch"
      />
    </fieldset>
  </div>
</template>
