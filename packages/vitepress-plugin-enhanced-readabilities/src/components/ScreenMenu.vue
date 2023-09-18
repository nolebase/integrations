<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import { LayoutMode } from '../types'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'

const mounted = useMounted()
const { t } = useI18n()
</script>

<template>
  <div space-y-2 v-if="mounted">
    <MenuTitle
      icon="i-icon-park-outline:book-open"
      :title="t('title.title')"
      :aria-label="t('title.titleArialLabel') || t('title.title')"
    />
    <div flex="~ col" pl-4 space-y-2>
      <div space-y-2>
        <MenuTitle
          icon="i-icon-park-outline:layout-one"
          :title="t('layoutSwitch.title')"
          :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
          disabled
        />
        <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
          <span text-xs>{{ t('layoutSwitch.titleScreenNavWarningMessage') }}</span>
        </div>
        <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
          <MenuOption
            :value="LayoutMode.FullWidth"
            icon="i-icon-park-outline:full-screen-one"
            :title="t('layoutSwitch.optionFullWidth')"
            :aria-label="t('layoutSwitch.optionFullWidthAriaLabel')"
            name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
            disabled
          />
          <MenuOption
            :value="LayoutMode.OnlySidebarFullWidth"
            icon="i-icon-park-outline:off-screen"
            :title="t('layoutSwitch.optionOnlySidebarFullWidth')"
            :aria-label="t('layoutSwitch.optionOnlySidebarFullWidthAriaLabel')"
            name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
            disabled
          />
          <MenuOption
            :value="LayoutMode.FitContentWidth"
            icon="i-icon-park-outline:off-screen-one"
            :title="t('layoutSwitch.optionFitContentWidth')"
            :aria-label="t('layoutSwitch.optionFitContentWidthAriaLabel')"
            name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
            disabled
          />
        </div>
      </div>
      <div space-y-2>
        <MenuTitle
          icon="i-icon-park-outline:click"
          :title="t('inlineHighlight.title')"
          :aria-label="t('inlineHighlight.titleArialLabel') || t('inlineHighlight.title')"
          disabled
        />
        <div border="1 red/50 solid" bg="red/30" p-2 rounded-xl flex items-center opacity-50>
          <span text-xs>{{ t('inlineHighlight.titleScreenNavWarningMessage') }}</span>
        </div>
        <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
          <MenuOption
            :value="true"
            :title="t('inlineHighlight.optionOn')"
            :aria-label="t('inlineHighlight.optionOnAriaLabel')"
            text="ON"
            name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
            disabled
          />
          <MenuOption
            :value="false"
            :title="t('inlineHighlight.optionOff')"
            :aria-label="t('inlineHighlight.optionOffAriaLabel')"
            text="OFF"
            name="VitePress Nolebase Enhanced Readabilities Inline Highlighter Mode Switch"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>
