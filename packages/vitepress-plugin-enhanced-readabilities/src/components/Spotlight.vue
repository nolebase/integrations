<script setup lang="ts">
import { onMounted, ref, watch, inject } from 'vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import SpotlightHoverBlock from './SpotlightHoverBlock.vue'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import MenuHelp from './MenuHelp.vue'
import { InjectionKey, SpotlightToggledStorageKey } from '../constants'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isTouchScreen = useMediaQuery('(pointer: coarse)')
const spotlightToggledOn = useStorage(SpotlightToggledStorageKey, options.spotlight?.defaultToggle || false)
const { t } = useI18n()

onMounted(() => {
  console.log(isTouchScreen.value)
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
    <div flex items-center relative ref="menuTitleElementRef">
      <MenuTitle
        icon="i-icon-park-outline:click"
        :title="t('spotlight.title')"
        :aria-label="t('spotlight.titleArialLabel') || t('spotlight.title')"
        :disabled="disabled"
        flex="1"
        mr-4
      />
      <MenuHelp
        v-if="!options.spotlight?.disableHelp"
        :menu-title-element-ref="menuTitleElementRef"
        v-model:is-popped-up="isMenuHelpPoppedUp"
      >
        <h4 text-md font-semibold mb-1>
          {{ t('spotlight.title') }}
        </h4>
        <p max-w-100 text="sm" mb-2>
          <span>{{ t('spotlight.titleHelpMessage') }}</span>
        </p>
        <div space-y-2>
          <p max-w-100 text="sm" bg="$vp-c-default-soft" p-3 rounded-xl>
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>ON</span>
              <span>{{ t('spotlight.optionOn') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOnHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="$vp-c-default-soft" p-3 rounded-xl>
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>OFF</span>
              <span>{{ t('spotlight.optionOff') }}</span>
            </h5>
            <span>{{ t('spotlight.optionOffHelpMessage') }}</span>
          </p>
        </div>
      </MenuHelp>
    </div>
    <fieldset flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full appearance-none border-none
      outline="transparent 2px offset-4px dashed" transition="outline duration-200 ease"
      :class="{
        'outline-$vp-c-brand-1!': isMenuHelpPoppedUp,
        'rounded-md': isMenuHelpPoppedUp
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
