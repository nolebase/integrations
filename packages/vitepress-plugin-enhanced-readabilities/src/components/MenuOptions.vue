<script setup lang="ts">
import { computed } from 'vue'

import MenuOption from './MenuOption.vue'

interface Option {
  name: string
  icon?: string
  text?: string
  title: string
  ariaLabel: string
  value?: any
}

interface Props {
  disabled?: boolean
  modelValue?: any
  options: Option[]
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
})
</script>

<template>
  <fieldset
    flex="~ row"
    bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
    text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
    w-full appearance-none rounded-lg rounded-md border-none p-1 space-x-2
  >
    <MenuOption
      v-for="option in props.options"
      :key="option.name"
      v-model="model"
      :name="option.name"
      :icon="option.icon"
      :title="option.title"
      :text="option.text"
      :aria-label="option.ariaLabel"
      :disabled="props.disabled"
      :value="option.value"
    />
  </fieldset>
</template>
