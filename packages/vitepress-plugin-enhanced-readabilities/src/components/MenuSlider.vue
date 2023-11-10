<script setup lang="ts">
import { useElementHover } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  disabled?: boolean
  modelValue: number
  min?: number
  max?: number
  formatter?: (number) => string
}>(), {
  min: 0,
  max: 100
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
  if (!inputSliderRef.value) return

  inputSliderRef.value.style.setProperty('--vp-nolebase-enhanced-readabilities-menu-slider-value', inputValue.value.toString())
  inputSliderRef.value.style.setProperty('--vp-nolebase-enhanced-readabilities-menu-slider-min', !!props.min ? props.min.toString() : '0')
  inputSliderRef.value.style.setProperty('--vp-nolebase-enhanced-readabilities-menu-slider-max', !!props.max ? props.max.toString() : '100')
  inputSliderRef.value.addEventListener('input', () => {
    if (!inputSliderRef.value) return

    inputSliderRef.value.style.setProperty('--vp-nolebase-enhanced-readabilities-menu-slider-value', inputSliderRef.value.value.toString())
  })
})

function positionTooltipBasedOnInputAndTooltipElement(inputElement: HTMLInputElement, inputTooltipElement: HTMLDivElement) {
  if (!inputElement) return
  if (!inputTooltipElement) return

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
  if (val < min.value) val = min.value
  if (val > max.value) val = max.value
  emits('update:modelValue', val)
})

watch(min, (val) => {
  if (inputValue.value >= val) return
  inputValue.value = val
})

watch(max, (val) => {
  if (inputValue.value <= val) return
  inputValue.value = val
})

watch(hovering, (val) => {
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

watch(inputValue, (val) => {
  if (!inputSliderRef.value) {
    return
  }
  if (!inputSliderTooltipRef.value) {
    return
  }

  positionTooltipBasedOnInputAndTooltipElement(inputSliderRef.value, inputSliderTooltipRef.value)
})
</script>

<template>
  <label
    class="VPNolebaseEnhancedReadabilitiesMenuSlider VPNolebaseEnhancedReadabilitiesMenuSliderLabel"
    select-none
    w-full
    relative
  >
    <input
      type="range"
      ref="inputSliderRef"
      v-model="inputValue"
      :name="props.name"
      :min="props.min"
      :max="props.max"
      :disabled="props.disabled"
      :class="{ disabled: props.disabled }"
      step="1"
      class="VPNolebaseEnhancedReadabilitiesMenuSliderInput VPNolebaseEnhancedReadabilitiesMenuSliderInputProgressIndicator"
      w-full
    >
    <Transition name="fade">
      <span
        v-show="hovering"
        ref="inputSliderTooltipRef"
        class="VPNolebaseEnhancedReadabilitiesMenuSliderTooltip"
        p-2 bg-black absolute rounded-lg text-white text-center
        min-w-12
        :class="{ 'opacity-0': hovering && positioning }"
      >
        {{ !!props.formatter ? props.formatter(inputValue) : inputValue }}
      </span>
    </Transition>
  </label>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesMenuSlider {
  --vp-nolebase-enhanced-readabilities-menu-slider-height: 32px;
  --vp-nolebase-enhanced-readabilities-menu-slider-shadow-color: #aeaeaecd;

  --vp-nolebase-enhanced-readabilities-menu-slider-thumb-height: 32px;
  --vp-nolebase-enhanced-readabilities-menu-slider-thumb-width: 32px;
  --vp-nolebase-enhanced-readabilities-menu-slider-thumb-border-radius: 6px;
  --vp-nolebase-enhanced-readabilities-menu-slider-thumb-color: #FFFFFF;

  --vp-nolebase-enhanced-readabilities-menu-slider-track-height: calc(var(--vp-nolebase-enhanced-readabilities-menu-slider-height) - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding) * 2);
  --vp-nolebase-enhanced-readabilities-menu-slider-track-border-radius: 6px;
  --vp-nolebase-enhanced-readabilities-menu-slider-track-color: #FFFFFF;

  --vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color: #FFFFFF;
  --vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding: 0px;
}

.dark {
  .VPNolebaseEnhancedReadabilitiesMenuSlider {
    --vp-nolebase-enhanced-readabilities-menu-slider-shadow-color: #535353db;

    --vp-nolebase-enhanced-readabilities-menu-slider-thumb-color: #e1e2da;

    --vp-nolebase-enhanced-readabilities-menu-slider-track-color: #e1e2da;

    --vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color: #e1e2da;
  }
}

.VPNolebaseEnhancedReadabilitiesMenuSliderLabel {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-height);
  cursor: col-resize;
}

/*
  Generated with Input range slider CSS style generator (version 20211225)
  https://toughengineer.github.io/demo/slider-styler
*/
.VPNolebaseEnhancedReadabilitiesMenuSliderInput {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-height);
  margin: 0 0;
  appearance: none;
  -webkit-appearance: none;
  transition: background-color 0.2s ease;
  cursor: col-resize;
}

/* Progress */
.VPNolebaseEnhancedReadabilitiesMenuSliderInput.VPNolebaseEnhancedReadabilitiesMenuSliderInputProgressIndicator {
  --vp-nolebase-enhanced-readabilities-menu-slider-range: calc(var(--vp-nolebase-enhanced-readabilities-menu-slider-max) - var(--vp-nolebase-enhanced-readabilities-menu-slider-min));
  --vp-nolebase-enhanced-readabilities-menu-slider-ratio: calc((var(--vp-nolebase-enhanced-readabilities-menu-slider-value) - var(--vp-nolebase-enhanced-readabilities-menu-slider-min)) / var(--vp-nolebase-enhanced-readabilities-menu-slider-range));
  --vp-nolebase-enhanced-readabilities-menu-slider-sx: calc(0.5 * var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-width) + var(--vp-nolebase-enhanced-readabilities-menu-slider-ratio) * (100% - var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-width)));
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput:focus {
  outline: none;
}

/* Webkit */
.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-width);
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-height);
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-border-radius);
  background: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--vp-nolebase-enhanced-readabilities-menu-slider-shadow-color);
  margin-top: calc(var(--vp-nolebase-enhanced-readabilities-menu-slider-track-height) * 0.5 - var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-height) * 0.5);
  margin-left: calc(0 - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-webkit-slider-runnable-track {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-height);
  border: none;
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-border-radius);
  background: #F1F1F100;
  box-shadow: none;
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput.VPNolebaseEnhancedReadabilitiesMenuSliderInputProgressIndicator::-webkit-slider-runnable-track {
  background: linear-gradient(var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color), var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color)) 0/var(--vp-nolebase-enhanced-readabilities-menu-slider-sx) 100% no-repeat, #ffffff00;
  margin-left: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding);
  margin-right: calc(0 - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  cursor: col-resize;
}

/* Firefox */
.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-moz-range-thumb {
  width: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-width);
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-height);
  margin-left: calc(0 - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-border-radius);
  background: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--vp-nolebase-enhanced-readabilities-menu-slider-shadow-color);
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-moz-range-track {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-height);
  border: none;
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-border-radius);
  background: #F1F1F100;
  box-shadow: none;
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput.VPNolebaseEnhancedReadabilitiesMenuSliderInputProgressIndicator::-moz-range-track {
  background: linear-gradient(var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color),var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color)) 0/var(--vp-nolebase-enhanced-readabilities-menu-slider-sx) 100% no-repeat, #ffffff00;
  display: block;
  /* Trim left and right 4px paddings of track */
  width: calc(100% - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding) - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  cursor: col-resize;
}

/* Microsoft */
.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-ms-fill-upper {
  background: transparent;
  border-color: transparent;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-ms-fill-lower {
  background: transparent;
  border-color: transparent;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-ms-thumb {
  width: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-width);
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-height);
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-border-radius);
  background: (--vp-nolebase-enhanced-readabilities-menu-slider-thumb-color);
  border: none;
  box-shadow: 0 2px 4px 0px var(--vp-nolebase-enhanced-readabilities-menu-slider-shadow-color);
  box-sizing: border-box;
  /** Center thumb */
  margin-top: 0;
  /** Shift left thumb */
  margin-left: calc(0 - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput::-ms-track {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-height);
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-thumb-border-radius);
  background: #F1F1F100;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderInput.VPNolebaseEnhancedReadabilitiesMenuSliderInputProgressIndicator::-ms-fill-lower {
  height: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-height);
  border-radius: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-border-radius) 0 0 var(--vp-nolebase-enhanced-readabilities-menu-slider-track-border-radius);
  background: var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-color);
  border: none;
  border-right-width: 0;
  margin-top: 0;
  margin-bottom: 0;
  /** Shift left thumb */
  margin-left: calc(var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  /** Shift right thumb */
  margin-right: calc(0 - var(--vp-nolebase-enhanced-readabilities-menu-slider-track-progress-padding));
  cursor: col-resize;
}

.VPNolebaseEnhancedReadabilitiesMenuSliderTooltip {
  top: calc(0px - var(--vp-nolebase-enhanced-readabilities-menu-slider-height) - 16px);
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
