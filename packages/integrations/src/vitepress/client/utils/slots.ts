import type { Layout, Slots } from './types'

export function applySlots(globalSlots: Record<string, Array<() => Slots[number]>> = {}, slots: Layout['slots']) {
  if (!slots)
    return

  for (const [key, value] of Object.entries(slots)) {
    if (value.override) {
      // Ensure value.node is treated as an array, even if it's a single function.
      globalSlots[key] = Array.isArray(value.node) ? value.node : [value.node]
    }
    else {
      // If the key doesn't exist, initialize it with an empty array.
      if (!globalSlots[key])
        globalSlots[key] = []

      // Concatenate the existing slots with the new ones, ensuring value.node is an array.
      globalSlots[key] = globalSlots[key].concat(Array.isArray(value.node) ? value.node : [value.node])
    }
  }
}
