<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import InlineHighlightHighlighter from './InlineHighlightHighlighter.vue'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'
import MenuHelp from './MenuHelp.vue'

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const inlineHighlightModeOn = useStorage('vitepress-nolebase-enhanced-readabilities-inline-highlight-mode', false)
const { t } = useI18n()

onMounted(() => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, disabled inline highlight mode.')
    inlineHighlightModeOn.value = false
  }
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, disabled inline highlight mode.')
    inlineHighlightModeOn.value = false
  }
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <InlineHighlightHighlighter v-if="mounted && inlineHighlightModeOn" :enabled="inlineHighlightModeOn" />
    <div flex items-center relative>
      <MenuTitle
        icon="i-icon-park-outline:click"
        :title="t('inlineHighlight.title')"
        :aria-label="t('inlineHighlight.titleArialLabel') || t('inlineHighlight.title')"
        flex="1"
        mr-4
      />
      <MenuHelp>
        <h4 text-md font-semibold mb-1>
          {{ t('inlineHighlight.title') }}
        </h4>
        <p max-w-100 text="sm" mb-2>
          <span>{{ t('inlineHighlight.titleHelpMessage') }}</span>
        </p>
        <div space-y-2>
          <p max-w-100 text="sm" bg="zinc-700 dark:zinc-900" p-2 rounded-lg>
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>ON</span>
              <span>{{ t('inlineHighlight.optionOn') }}</span>
            </h5>
            <span>{{ t('inlineHighlight.optionOnHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="zinc-700 dark:zinc-900" p-2 rounded-lg>
            <h5 text="sm" mb-1>
              <span mr-1 font-bold>OFF</span>
              <span>{{ t('inlineHighlight.optionOff') }}</span>
            </h5>
            <span>{{ t('inlineHighlight.optionOffHelpMessage') }}</span>
          </p>
        </div>
      </MenuHelp>
    </div>
    <fieldset flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full appearance-none border-none>
      <MenuOption
        v-model="inlineHighlightModeOn"
        :title="t('inlineHighlight.optionOn')"
        :aria-label="t('inlineHighlight.optionOnAriaLabel')"
        text="ON"
        name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
        :value="true"
      />
      <MenuOption
        v-model="inlineHighlightModeOn"
        :title="t('inlineHighlight.optionOff')"
        :aria-label="t('inlineHighlight.optionOffAriaLabel')"
        text="OFF"
        name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
        :value="false"
      />
    </fieldset>
  </div>
</template>
