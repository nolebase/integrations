import type { Theme } from 'vitepress'

import type { DefineThemeUnconfigOptions, Layout, Slots } from './types'

import DefaultTheme from 'vitepress/theme'

import { h } from 'vue'

export type { DefineThemeUnconfigOptions, Layout, Plugin, PluginSet, Slots } from './types'

function applySlots(globalSlots: Record<string, Array<() => Slots[number]>> = {}, slots: Layout['slots']) {
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

function defineSlot(globalSlots: Record<string, Array<() => Slots[number]>>): (name: string, node: () => Slots[number], override?: boolean) => void | Promise<void> {
  return (name, node, override) => {
    if (override) {
      globalSlots[name] = [node]
      return
    }
    if (globalSlots[name]) {
      globalSlots[name].push(node)
      return
    }

    globalSlots[name] = [node]
  }
}

function applyLayout(options: DefineThemeUnconfigOptions) {
  const slots: Record<string, Array<() => Slots[number]>> = {}

  if (options.layout?.slots)
    applySlots(slots, options.layout.slots)

  if (options.plugins) {
    for (const plugin of options.plugins) {
      if (plugin.configureLayout) {
        plugin.configureLayout({ helpers: {
          defineSlot: defineSlot(slots),
        } })
      }
    }
  }

  if (options.pluginPresets) {
    for (const pluginSet of options.pluginPresets) {
      if (pluginSet.configureLayout) {
        pluginSet.configureLayout({ helpers: {
          defineSlot: defineSlot(slots),
        } })
      }
    }
  }

  const aggregatedSlots: Record<string, () => Slots> = Object.fromEntries(
    Object
      .entries(slots)
      .map(([key, value]) => {
        return [key, () => value.map(v => v())]
      }),
  )

  return h(
    options.extends?.Layout ?? DefaultTheme.Layout,
    null,
    aggregatedSlots,
  )
}

export function defineThemeUnconfig(options: DefineThemeUnconfigOptions): Theme {
  return {
    extends: options.extends ?? DefaultTheme,
    Layout: applyLayout(options),
    async enhanceApp(ctx) {
      if (options?.enhanceApp)
        options.enhanceApp(ctx)

      if (options.plugins) {
        for (const plugin of options.plugins) {
          if (typeof plugin.enhanceApp !== 'undefined' && typeof plugin.enhanceApp === 'function')
            await plugin.enhanceApp(ctx)
        }
      }

      if (options.pluginPresets) {
        for (const pluginSet of options.pluginPresets) {
          if (typeof pluginSet.enhanceApp !== 'undefined' && typeof pluginSet.enhanceApp === 'function')
            await pluginSet.enhanceApp(ctx)
        }
      }
    },
  }
}
