<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  name: any
  value?: any
  icon?: string
  text?: string
  title: string
  disabled?: boolean
  modelValue?: any
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
})
</script>

<template>
  <label
    :title="props.title"
    class="VPNavBarNolebaseEnhancedReadabilitiesMenuOption"
    :class="{ active: model === props.value, disabled: props.disabled }"
    w-full py-2 px-3
    inline-flex items-center justify-center
    rounded-md
    text="[14px]" font-medium
    cursor-pointer select-none
  >
    <input
      v-model="model"
      type="radio"
      :value="props.value"
      :name="props.name"
      :checked="model === props.value"
      :aria-checked="model === props.value"
      role="radio"
      hidden
    >
    <span inline-flex="~" items-center align-middle>
      <span v-if="props.icon" :class="props.icon" aria-hidden="true" />
      <span v-if="props.text">{{ props.text }}</span>
    </span>
  </label>
</template>

<style less>
.VPNavBarNolebaseEnhancedReadabilitiesMenuOption {
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s;

  &.active {
    color: var(--vp-c-brand-1);
    font-weight: bold;
    background-color: var(--vp-c-default-soft);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    font-weight: normal;
    background-color: var(--vp-c-default-soft);
  }

  &:hover {
    color: var(--vp-c-brand-1);
    background-color: var(--vp-c-default-soft);
  }
}
</style>