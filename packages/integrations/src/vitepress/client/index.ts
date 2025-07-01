import type { PresetClientOptions } from './types'
import type { PresetClient, Slots } from './utils'

import defu from 'defu'

import { LayoutMode, NolebaseEnhancedReadabilitiesMenu, NolebaseEnhancedReadabilitiesScreenMenu } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { NolebaseHighlightTargetedHeading } from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
import { h } from 'vue'

function newArrayOfOrPush<K extends PropertyKey, V>(object: Record<K, V[]>, property: K, item: V) {
  if (object[property]) {
    object[property].push(item)
    return
  }

  object[property] = [item]
}

export function presetClient<PagePropertiesObject extends object = any>(options?: PresetClientOptions<PagePropertiesObject>): PresetClient {
  const opts = defu<PresetClientOptions, PresetClientOptions[]>(options, {
    enhancedMark: true as any,
    enhancedReadabilities: {
      options: {
        layoutSwitch: { defaultMode: LayoutMode.SidebarWidthAdjustableOnly },
        spotlight: { defaultToggle: true },
      },
    },
    gitChangelog: {
      options: {
        commitsRelativeTime: true,
      },
    },
    highlightTargetedHeading: true as any,
    index: true as any,
    inlineLinkPreview: true as any,
    pageProperties: {
      options: {
        properties: {
          'en': [
            { key: 'tags', type: 'tags', title: 'Tags' },
            { key: 'progress', type: 'progress', title: 'Progress' },
            { key: 'createdAt', type: 'datetime', title: 'Created at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
            { key: 'updatedAt', type: 'datetime', title: 'Updated at', formatAsFrom: true, dateFnsLocaleName: 'enUS' },
            { key: 'wordsCount', type: 'dynamic', title: 'Word count', options: { type: 'wordsCount' } },
            { key: 'readingTime', type: 'dynamic', title: 'Reading time', options: { type: 'readingTime', dateFnsLocaleName: 'enUS' } },
          ],
          'zh-CN': [
            { key: 'tags', type: 'tags', title: '标签' },
            { key: 'progress', type: 'progress', title: '进度' },
            { key: 'createdAt', type: 'datetime', title: '创建时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
            { key: 'updatedAt', type: 'datetime', title: '更新时间', formatAsFrom: true, dateFnsLocaleName: 'zhCN' },
            { key: 'wordsCount', type: 'dynamic', title: '字数', options: { type: 'wordsCount' } },
            { key: 'readingTime', type: 'dynamic', title: '阅读时间', options: { type: 'readingTime', dateFnsLocaleName: 'zhCN' } },
          ],
        },
      },
    },
    thumbnailHash: true as any,
  })

  return {
    enhanceLayout() {
      const slots: Record<string, Array<() => Slots[number]>> = {}

      if (opts.highlightTargetedHeading)
        newArrayOfOrPush(slots, 'doc-top', () => h(NolebaseHighlightTargetedHeading))

      if (opts.enhancedReadabilities) {
        newArrayOfOrPush(slots, 'nav-bar-content-after', () => h(NolebaseEnhancedReadabilitiesMenu))
        newArrayOfOrPush(slots, 'nav-screen-content-after', () => h(NolebaseEnhancedReadabilitiesScreenMenu))
      }

      return slots
    },
    async enhanceApp({ app }) {
      if (opts.enhancedReadabilities) {
        const { NolebaseEnhancedReadabilitiesPlugin } = await import('@nolebase/vitepress-plugin-enhanced-readabilities/client')
        await import('@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css')

        const enhancedReadabilitiesOptions = opts.enhancedReadabilities?.options ? [opts.enhancedReadabilities.options] : []
        app.use(NolebaseEnhancedReadabilitiesPlugin, ...enhancedReadabilitiesOptions)
      }

      if (opts.highlightTargetedHeading) {
        const { NolebaseNolebaseHighlightTargetedHeadingPlugin } = await import('@nolebase/vitepress-plugin-highlight-targeted-heading/client')
        await import('@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css')

        app.use(NolebaseNolebaseHighlightTargetedHeadingPlugin)
      }

      if (opts.inlineLinkPreview) {
        const { NolebaseInlineLinkPreviewPlugin } = await import('@nolebase/vitepress-plugin-inline-link-preview/client')
        await import('@nolebase/vitepress-plugin-inline-link-preview/client/style.css')

        const linkPreviewOptions = opts.inlineLinkPreview?.options ? [opts.inlineLinkPreview.options] : []
        app.use(NolebaseInlineLinkPreviewPlugin, ...linkPreviewOptions)
      }

      if (opts.gitChangelog) {
        const { NolebaseGitChangelogPlugin } = await import('@nolebase/vitepress-plugin-git-changelog/client')
        await import('@nolebase/vitepress-plugin-git-changelog/client/style.css')

        const gitChangelogOptions = opts.gitChangelog?.options ? [opts.gitChangelog.options] : []
        app.use(NolebaseGitChangelogPlugin, ...gitChangelogOptions)
      }

      if (opts.pageProperties) {
        const { NolebasePagePropertiesPlugin } = await import('@nolebase/vitepress-plugin-page-properties/client')
        await import('@nolebase/vitepress-plugin-page-properties/client/style.css')

        const pagePropertiesOptions = opts.pageProperties?.options ? [opts.pageProperties.options] : []
        app.use(NolebasePagePropertiesPlugin<PagePropertiesObject>(), ...pagePropertiesOptions)
      }

      if (opts.enhancedMark)
        await import('@nolebase/vitepress-plugin-enhanced-mark/client/style.css')

      if (opts.thumbnailHash) {
        const { NolebaseUnlazyImg } = await import('@nolebase/vitepress-plugin-thumbnail-hash/client')
        await import('@nolebase/vitepress-plugin-thumbnail-hash/client/style.css')

        app.component('NolebaseUnlazyImg', NolebaseUnlazyImg)
      }

      if (opts.index) {
        const { NolebaseIndexPlugin } = await import('@nolebase/vitepress-plugin-index/client')
        await import('@nolebase/vitepress-plugin-index/client/style.css')

        app.use(NolebaseIndexPlugin)
      }
    },
  }
}
