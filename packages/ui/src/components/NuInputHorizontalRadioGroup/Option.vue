<script setup lang="ts">
import { computed } from 'vue'

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
    class="nolebase-ui-input-horizontal-option"
    :class="{ active: model === props.value && !props.disabled, disabled: props.disabled }"
    :disabled="props.disabled"
    text="[14px]"
    w-full inline-flex cursor-pointer select-none
    items-center justify-center
    rounded-md px-3 py-2 font-medium
  >
    <input
      v-model="model"
      type="radio"
      :value="props.value"
      :name="props.name"
      :checked="model === props.value"
      :aria-checked="model === props.value"
      :disabled="props.disabled"
      role="radio"
      hidden
    >
    <span inline-flex="~" items-center align-middle>
      <span v-if="props.icon" :class="props.icon" aria-hidden="true" />
      <span v-if="props.text" :class="[!!props.icon ? 'ml-1' : '']">{{ props.text }}</span>
    </span>
  </label>
</template>

<style less>
.nolebase-ui-input-horizontal-option {
  --nolebase-ui-input-horizontal-option-text: var(--vp-c-text-1);
  --nolebase-ui-input-horizontal-option-active-text: var(--vp-c-text-1);
  --nolebase-ui-input-horizontal-option-active-bg: var(--vp-c-bg-elv);
  --nolebase-ui-input-horizontal-option-shadow-color: #bababa8c;
}

.dark {
  .nolebase-ui-input-horizontal-option {
    --nolebase-ui-input-horizontal-option-text: var(--vp-c-text-1);
    --nolebase-ui-input-horizontal-option-active-text: var(--vp-c-bg-elv);
    --nolebase-ui-input-horizontal-option-active-bg: var(--vp-c-text-1);
    --nolebase-ui-input-horizontal-option-shadow-color: #535353db;
  }
}

.nolebase-ui-input-horizontal-option {
  color: var(--nolebase-ui-input-horizontal-option-text);
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s, box-shadow 0.25s;

  &.active {
    font-weight: bold;
    color: var(--nolebase-ui-input-horizontal-option-active-text);
    background-color: var(--nolebase-ui-input-horizontal-option-active-bg);
    box-shadow: 0 2px 4px 0px var(--nolebase-ui-input-horizontal-option-shadow-color);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: var(--nolebase-ui-input-horizontal-option-active-text);
  }

  &:not(.disabled):hover {
    color: var(--nolebase-ui-input-horizontal-option-active-text);
    background-color: var(--nolebase-ui-input-horizontal-option-active-bg);
    box-shadow: 0 2px 4px 0px var(--nolebase-ui-input-horizontal-option-shadow-color);
  }
}

.dark {
  .nolebase-ui-input-horizontal-option {
    &.active {
      color: var(--nolebase-ui-input-horizontal-option-active-text);
      background-color: var(--nolebase-ui-input-horizontal-option-active-bg);
      box-shadow: 0 2px 4px 0 var(--nolebase-ui-input-horizontal-option-shadow-color);
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: var(--nolebase-ui-input-horizontal-option-text);
    }

    &:not(.disabled):hover {
      color: var(--nolebase-ui-input-horizontal-option-active-text);
      background-color: var(--nolebase-ui-input-horizontal-option-active-bg);
      box-shadow: 0 2px 4px 0 var(--nolebase-ui-input-horizontal-option-shadow-color);
    }
  }
}
</style>
