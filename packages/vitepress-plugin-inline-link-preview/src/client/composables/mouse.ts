import { computed, ref, watch } from 'vue'
import { useDebounceFn, useMouse } from '@vueuse/core'

export function useMouseMovementDegree(options?: { interval: number, threshold: number }) {
  const interval = options?.interval === undefined ? 100 : options.interval
  const threshold = options?.threshold === undefined ? 20 : options.threshold

  const { x, y } = useMouse()
  const latestMouseX = ref(x.value)
  const latestMouseY = ref(y.value)

  const updateX = useDebounceFn((x) => {
    latestMouseX.value = x
  }, interval)
  const updateY = useDebounceFn((y) => {
    latestMouseY.value = y
  }, interval)

  watch(x, async (val) => {
    updateX(val)
  })
  watch(y, async (val) => {
    updateY(val)
  })

  const lastMovementDegree = ref(0)

  const movementDegree = computed(() => {
    const xDiff = x.value - latestMouseX.value
    const yDiff = y.value - latestMouseY.value
    if (Math.abs(xDiff) < threshold && Math.abs(yDiff) < threshold)
      return lastMovementDegree.value

    const degree = (Math.atan2(yDiff, xDiff))
    lastMovementDegree.value = (360 + Math.round(degree)) % 360
    return lastMovementDegree.value
  })

  return {
    movementDegree,
  }
}
