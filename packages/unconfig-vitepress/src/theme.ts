import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import type {
  Options as NolebaseEnhancedReadabilitiesOptions,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesPlugin,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import type {
  Options as NolebaseInlineLinkPreviewOptions,
} from '@nolebase/vitepress-plugin-inline-link-preview'
import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  NolebaseHighlightTargetedHeading,
  NolebaseNolebaseHighlightTargetedHeadingPlugin,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import type {
  Options as NolebaseGitChangelogOptions,
} from '@nolebase/vitepress-plugin-git-changelog/client'
import {
  NolebaseGitChangelogPlugin,
} from '@nolebase/vitepress-plugin-git-changelog/client'

import type {
  Options as NolebasePagePropertiesOptions,
} from '@nolebase/vitepress-plugin-page-properties/client'
import {
  NolebasePagePropertiesPlugin,
} from '@nolebase/vitepress-plugin-page-properties/client'

type Slots = ReturnType<typeof h>[]

export function defineThemeConfig<PagePropertiesObject extends object = any>(options: {
  extends?: Theme
  layout?: {
    layout?: Theme['Layout']
    slots?: {
      [key: string]: {
        node: Array<() => Slots[number]>
        override?: boolean
      }
    }
  }
  enhanceApp?: Theme['enhanceApp']
  nolebase?: {
    enhancedReadabilities?: {
      enable?: boolean
      options?: NolebaseEnhancedReadabilitiesOptions
    }
    highlightTargetedHeading?: {
      enable?: boolean
    }
    linkPreview?: {
      enable?: boolean
      options?: NolebaseInlineLinkPreviewOptions
    }
    gitChangelog?: {
      enable?: boolean
      options?: NolebaseGitChangelogOptions
    }
    pageProperties?: {
      enable?: boolean
      options?: NolebasePagePropertiesOptions<PagePropertiesObject>
    }
  }
}): Theme {
  const layout = options.layout?.layout
    ? options.layout?.layout
    : () => {
        const layoutTop: Array<() => Slots[number]> = []
        if (options.nolebase?.highlightTargetedHeading?.enable)
          layoutTop.push(() => h(NolebaseHighlightTargetedHeading))

        const navBarContentAfter: Array<() => Slots[number]> = []
        if (options.nolebase?.enhancedReadabilities?.enable)
          navBarContentAfter.push(() => h(NolebaseEnhancedReadabilitiesMenu))

        const navScreenContentAfter: Array<() => Slots[number]> = []
        if (options.nolebase?.enhancedReadabilities?.enable)
          navScreenContentAfter.push(() => h(NolebaseEnhancedReadabilitiesScreenMenu))

        const slots: Record<string, Array<() => Slots[number]>> = {
          'layout-top': [
            ...layoutTop,
          ],
          'nav-bar-content-after': [
            ...navBarContentAfter,
          ],
          'nav-screen-content-after': [
            ...navScreenContentAfter,
          ],
        }

        if (options.layout?.slots) {
          for (const [key, value] of Object.entries(options.layout.slots)) {
            if (value.override) {
              slots[key] = value.node
              continue
            }
            if (slots[key]) {
              slots[key] = [...slots[key], ...value.node]
              continue
            }

            slots[key].push(...value.node)
          }
        }

        return h(
          options.extends?.Layout ?? DefaultTheme.Layout,
          null,
          Object.fromEntries(
            Object
              .entries(slots)
              .map(([key, value]) => {
                return [key, () => value.map(v => v())]
              }),
          ) as Record<string, () => Slots>,
        )
      }

  return {
    extends: options.extends ?? DefaultTheme,
    Layout: layout,
    async enhanceApp(ctx) {
      const { app } = ctx

      if (options.nolebase?.enhancedReadabilities?.enable) {
        const enhancedReadabilitiesOptions = options.nolebase?.enhancedReadabilities?.options ? [options.nolebase.enhancedReadabilities.options] : []
        app.use(NolebaseEnhancedReadabilitiesPlugin, ...enhancedReadabilitiesOptions)

        await import('@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css')
      }

      if (options.nolebase?.highlightTargetedHeading?.enable)
        app.use(NolebaseNolebaseHighlightTargetedHeadingPlugin)

      if (options.nolebase?.linkPreview?.enable) {
        const linkPreviewOptions = options.nolebase?.linkPreview?.options ? [options.nolebase.linkPreview.options] : []
        app.use(NolebaseInlineLinkPreviewPlugin, ...linkPreviewOptions)

        await import('@nolebase/vitepress-plugin-inline-link-preview/dist/style.css')
      }

      if (options.nolebase?.gitChangelog?.enable) {
        const gitChangelogOptions = options.nolebase?.gitChangelog?.options ? [options.nolebase.gitChangelog.options] : []
        app.use(NolebaseGitChangelogPlugin, ...gitChangelogOptions)
      }

      if (options.nolebase?.pageProperties?.enable) {
        const pagePropertiesOptions = options.nolebase?.pageProperties?.options ? [options.nolebase.pageProperties.options] : []
        app.use(NolebasePagePropertiesPlugin<PagePropertiesObject>(), ...pagePropertiesOptions)

        await import('@nolebase/vitepress-plugin-page-properties/client/style.css')
      }

      if (options?.enhanceApp)
        options.enhanceApp(ctx)
    },
  }
}
