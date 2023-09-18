<script setup lang="ts">
import { useI18n } from '../composables/i18n'

const { t } = useI18n()
</script>

<template>
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
</template>
