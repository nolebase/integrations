import type { Theme, EnhanceAppContext as VitePressEnhanceAppContext } from 'vitepress'
import type { h } from 'vue'

export type Slots = ReturnType<typeof h>[]

export interface Layout {
  slots?: {
    [key: string]: {
      node: Array<() => Slots[number]>
      override?: boolean
    }
  }
}

interface ConfigureLayoutContext {
  helpers: {
    defineSlot: (name: string, node: () => Slots[number], override?: boolean) => void
  }
}

interface EnhanceAppContext extends VitePressEnhanceAppContext {

}

export interface Plugin {
  configureLayout?: (context: ConfigureLayoutContext) => void
  enhanceApp?: (ctx: EnhanceAppContext) => void | Promise<void>
}

export interface PluginSet {
  configureLayout?: (context: ConfigureLayoutContext) => void
  enhanceApp?: (ctx: EnhanceAppContext) => void | Promise<void>
}

export interface DefineThemeUnconfigOptions {
  extends?: Theme
  layout?: Layout
  enhanceApp?: Theme['enhanceApp']
  plugins?: Array<Plugin>
  pluginPresets?: Array<PluginSet>
}
