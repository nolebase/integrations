import type { EnhanceAppContext as VitePressEnhanceAppContext } from 'vitepress'
import type { h } from 'vue'

export type Slots = ReturnType<typeof h>[]

export interface Layout {
  slots?: Record<string, { node: Array<() => Slots[number]>, override?: boolean }>
}

export interface PresetClient {
  enhanceLayout?: () => Record<string, Array<() => Slots[number]>>
  enhanceApp?: (ctx: VitePressEnhanceAppContext) => void | Promise<void>
}
