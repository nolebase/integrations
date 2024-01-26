<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(defineProps<{
  value: number
  max: number
}>(), {
  max: 100,
})

const data = useData()

const normalizedValue = computed(() => {
  const parsedValue = Number.parseFloat(props.value as any)
  if (Number.isNaN(parsedValue))
    return 0
  if (props.value < 0)
    return 0

  return Math.min(props.value, props.max)
})

const percentage = computed(() => {
  return Math.round((normalizedValue.value / props.max) * 100)
})

const percentageCssProperty = computed(() => {
  return `${percentage.value}%`
})

const color = computed(() => {
  if (!data.isDark.value)
    return `hsl(${percentage.value} 50% 60% / 1)`

  return `hsl(${percentage.value} 50% 35% / 1)`
})
</script>

<template>
  <span relative h-2 w-full :title="`${props.value.toFixed(0)}%`">
    <span
      absolute left-0 top-0
      inline-block h-full w-full rounded-full bg="dark:zinc-300 dark:zinc-700"
    />
    <span
      class="nolebase-progress-bar"
      transition="all ease-in-out"
      absolute left-0 top-0
      inline-block h-full
      rounded-full
      duration-1000
      :style="{ backgroundColor: color }"
    />
  </span>
</template>

<style scoped>
.nolebase-progress-bar {
  animation: nolebase-progress-bar-grow 1s cubic-bezier(0.4, 0, 0.2, 1) .25s forwards;
}

@keyframes nolebase-progress-bar-grow {
  0% {
    width: 0%;
    opacity: 0.5;
  }
  100% {
    width: v-bind(percentageCssProperty);
    opacity: 1;
  }
}
</style>
