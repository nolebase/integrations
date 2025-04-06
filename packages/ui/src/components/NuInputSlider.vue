<script setup lang="ts">
import { useElementHover } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  name?: string
  disabled?: boolean
  modelValue?: number
  min?: number
  max?: number
  step?: number
  formatter?: (arg: number) => string
}>(), {
  name: 'Slider',
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const inputSliderRef = ref<HTMLInputElement | null>(null)
const inputSliderTooltipRef = ref<HTMLDivElement | null>(null)
const inputValue = ref(props.modelValue)
const min = ref(props.min)
const max = ref(props.max)

const hovering = useElementHover(inputSliderRef)
const positioning = ref(false)

onMounted(() => {
  if (!inputSliderRef.value)
    return

  inputSliderRef.value.style.setProperty('--nolebase-ui-slider-value', inputValue.value.toString())
  inputSliderRef.value.style.setProperty('--nolebase-ui-slider-min', props.min ? props.min.toString() : '0')
  inputSliderRef.value.style.setProperty('--nolebase-ui-slider-max', props.max ? props.max.toString() : '100')
  inputSliderRef.value.addEventListener('input', () => {
    if (!inputSliderRef.value)
      return

    inputSliderRef.value.style.setProperty('--nolebase-ui-slider-value', inputSliderRef.value.value.toString())
  })
})

function positionTooltipBasedOnInputAndTooltipElement(inputElement: HTMLInputElement, inputTooltipElement: HTMLDivElement) {
  if (!inputElement)
    return
  if (!inputTooltipElement)
    return

  const max = (props.max ? props.max : 100)
  const min = (props.min ? props.min : 0)
  const ratio = ((inputValue.value - min) / (max - min))

  // calculate and center the tooltip above the thumb
  const rect = inputElement.getBoundingClientRect()
  const tooltipRect = inputTooltipElement.getBoundingClientRect()

  const centeringShift = (tooltipRect.width - 32) / 2
  inputTooltipElement.style.setProperty('left', `${ratio * (rect.width - 32) - centeringShift}px`)
}

watch(inputValue, (val) => {
  if (val < min.value)
    val = min.value
  if (val > max.value)
    val = max.value
  emits('update:modelValue', val)
})

watch(min, (val) => {
  if (inputValue.value >= val)
    return
  inputValue.value = val
})

watch(max, (val) => {
  if (inputValue.value <= val)
    return
  inputValue.value = val
})

watch(hovering, () => {
  positioning.value = true

  setTimeout(() => {
    if (!hovering.value) {
      positioning.value = false
      return
    }
    if (!inputSliderRef.value) {
      positioning.value = false
      return
    }
    if (!inputSliderTooltipRef.value) {
      positioning.value = false
      return
    }

    positionTooltipBasedOnInputAndTooltipElement(inputSliderRef.value, inputSliderTooltipRef.value)
    positioning.value = false
  }, 50)
})

watch(inputValue, () => {
  if (!inputSliderRef.value)
    return

  if (!inputSliderTooltipRef.value)
    return

  positionTooltipBasedOnInputAndTooltipElement(inputSliderRef.value, inputSliderTooltipRef.value)
})
</script>

<template>
  <div
    flex="~ row"
    bg="zinc-200/50 dark:zinc-800/50"
    w-full appearance-none rounded-lg border-none p-1 space-x-2
    text="sm zinc-300"
  >
    <label
      class="nolebase-ui-slider nolebase-ui-slider"
      relative w-full select-none
    >
      <input
        ref="inputSliderRef"
        v-model="inputValue"
        type="range"
        :name="props.name"
        :min="props.min"
        :max="props.max"
        :disabled="props.disabled"
        :class="{ disabled: props.disabled }"
        :step="props.step"
        class="nolebase-ui-slider-input nolebase-ui-slider-input-progress-indicator"
        w-full
      >
      <Transition name="fade">
        <span
          v-show="hovering"
          ref="inputSliderTooltipRef"
          class="nolebase-ui-slider-tooltip"

          absolute min-w-12 rounded-lg bg-black p-2 text-center text-white
          :class="{ 'opacity-0': hovering && positioning }"
        >
          {{ !!props.formatter ? props.formatter(inputValue) : inputValue }}
        </span>
      </Transition>
    </label>
  </div>
</template>

<style less>
.nolebase-ui-slider {
  --nolebase-ui-slider-height: 32px;
  --nolebase-ui-slider-shadow-color: #aeaeaecd;

  --nolebase-ui-slider-thumb-height: 32px;
  --nolebase-ui-slider-thumb-width: 32px;
  --nolebase-ui-slider-thumb-border-radius: 6px;
  --nolebase-ui-slider-thumb-color: #FFFFFF;

  --nolebase-ui-slider-track-height: calc(var(--nolebase-ui-slider-height) - var(--nolebase-ui-slider-track-progress-padding) * 2);
  --nolebase-ui-slider-track-border-radius: 6px;
  --nolebase-ui-slider-track-color: #FFFFFF;

  --nolebase-ui-slider-track-progress-color: #FFFFFF;
  --nolebase-ui-slider-track-progress-padding: 0px;
}

.dark .nolebase-ui-slider {
  --nolebase-ui-slider-shadow-color: #535353db;
  --nolebase-ui-slider-thumb-color: #e1e2da;
  --nolebase-ui-slider-track-color: #e1e2da;
  --nolebase-ui-slider-track-progress-color: #e1e2da;
}

.nolebase-ui-slider {
  height: var(--nolebase-ui-slider-height);
  cursor: col-resize;
}

/*
  Generated with Input range slider CSS style generator (version 20211225)
  https://toughengineer.github.io/demo/slider-styler
*/
.nolebase-ui-slider-input {
  height: var(--nolebase-ui-slider-height);
  margin: 0 0;
  appearance: none;
  -webkit-appearance: none;
  transition: background-color 0.2s ease;
  cursor: col-resize;
}

/* Progress */
.nolebase-ui-slider-input.nolebase-ui-slider-input-progress-indicator {
  --nolebase-ui-slider-range: calc(var(--nolebase-ui-slider-max) - var(--nolebase-ui-slider-min));
  --nolebase-ui-slider-ratio: calc((var(--nolebase-ui-slider-value) - var(--nolebase-ui-slider-min)) / var(--nolebase-ui-slider-range));
  --nolebase-ui-slider-sx: calc(0.5 * var(--nolebase-ui-slider-thumb-width) + var(--nolebase-ui-slider-ratio) * (100% - var(--nolebase-ui-slider-thumb-width)));
}

.nolebase-ui-slider-input:focus {
  outline: none;
}

/* Webkit */
.nolebase-ui-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--nolebase-ui-slider-thumb-width);
  height: var(--nolebase-ui-slider-thumb-height);
  border-radius: var(--nolebase-ui-slider-thumb-border-radius);
  background: var(--nolebase-ui-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--nolebase-ui-slider-shadow-color);
  margin-top: calc(var(--nolebase-ui-slider-track-height) * 0.5 - var(--nolebase-ui-slider-thumb-height) * 0.5);
  margin-left: calc(0 - var(--nolebase-ui-slider-track-progress-padding));
  cursor: col-resize;
}

.nolebase-ui-slider-input::-webkit-slider-runnable-track {
  height: var(--nolebase-ui-slider-track-height);
  border: none;
  border-radius: var(--nolebase-ui-slider-track-border-radius);
  background: #F1F1F100;
  box-shadow: none;
  cursor: col-resize;
}

.nolebase-ui-slider-input.nolebase-ui-slider-input-progress-indicator::-webkit-slider-runnable-track {
  background: linear-gradient(var(--nolebase-ui-slider-track-progress-color), var(--nolebase-ui-slider-track-progress-color)) 0/var(--nolebase-ui-slider-sx) 100% no-repeat, #ffffff00;
  margin-left: var(--nolebase-ui-slider-track-progress-padding);
  margin-right: calc(0 - var(--nolebase-ui-slider-track-progress-padding));
  cursor: col-resize;
}

/* Firefox */
.nolebase-ui-slider-input::-moz-range-thumb {
  width: var(--nolebase-ui-slider-thumb-width);
  height: var(--nolebase-ui-slider-thumb-height);
  margin-left: calc(0 - var(--nolebase-ui-slider-track-progress-padding));
  border-radius: var(--nolebase-ui-slider-thumb-border-radius);
  background: var(--nolebase-ui-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--nolebase-ui-slider-shadow-color);
  cursor: col-resize;
}

.nolebase-ui-slider-input::-moz-range-track {
  height: var(--nolebase-ui-slider-track-height);
  border: none;
  border-radius: var(--nolebase-ui-slider-track-border-radius);
  background: #F1F1F100;
  box-shadow: none;
  cursor: col-resize;
}

.nolebase-ui-slider-input.nolebase-ui-slider-input-progress-indicator::-moz-range-track {
  background: linear-gradient(var(--nolebase-ui-slider-track-progress-color),var(--nolebase-ui-slider-track-progress-color)) 0/var(--nolebase-ui-slider-sx) 100% no-repeat, #ffffff00;
  display: block;
  /* Trim left and right 4px paddings of track */
  width: calc(100% - var(--nolebase-ui-slider-track-progress-padding) - var(--nolebase-ui-slider-track-progress-padding));
  cursor: col-resize;
}

/* Microsoft */
.nolebase-ui-slider-input::-ms-fill-upper {
  background: transparent;
  border-color: transparent;
}

.nolebase-ui-slider-input::-ms-fill-lower {
  background: transparent;
  border-color: transparent;
}

.nolebase-ui-slider-input::-ms-thumb {
  width: var(--nolebase-ui-slider-thumb-width);
  height: var(--nolebase-ui-slider-thumb-height);
  border-radius: var(--nolebase-ui-slider-thumb-border-radius);
  background: (--nolebase-ui-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--nolebase-ui-slider-shadow-color);
  box-sizing: border-box;
  /** Center thumb */
  margin-top: 0;
  /** Shift left thumb */
  margin-left: calc(0 - var(--nolebase-ui-slider-track-progress-padding));
  cursor: col-resize;
}

.nolebase-ui-slider-input::-ms-track {
  height: var(--nolebase-ui-slider-track-height);
  border-radius: var(--nolebase-ui-slider-thumb-border-radius);
  background: #F1F1F100;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  cursor: col-resize;
}

.nolebase-ui-slider-input.nolebase-ui-slider-input-progress-indicator::-ms-fill-lower {
  height: var(--nolebase-ui-slider-track-height);
  border-radius: var(--nolebase-ui-slider-track-border-radius) 0 0 var(--nolebase-ui-slider-track-border-radius);
  background: var(--nolebase-ui-slider-track-progress-color);
  border: none;
  border-right-width: 0;
  margin-top: 0;
  margin-bottom: 0;
  /** Shift left thumb */
  margin-left: calc(var(--nolebase-ui-slider-track-progress-padding));
  /** Shift right thumb */
  margin-right: calc(0 - var(--nolebase-ui-slider-track-progress-padding));
  cursor: col-resize;
}

.nolebase-ui-slider-tooltip {
  top: calc(0px - var(--nolebase-ui-slider-height) - 16px);
  /* transform: translateX(-16px); */
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
