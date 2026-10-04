import type { EnhanceAppContext } from 'vitepress'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import { MotionPlugin } from '@vueuse/motion'

import HomeContent from '../components/HomeContent.vue'
import IntegrationCard from '../components/IntegrationCard.vue'
import ThumbhashPreview from '../components/ThumbhashPreview.vue'

/**
 * Registers app-level components and plugins shared by every docs theme.
 *
 * Use when:
 * - Adding a new docs theme entry.
 * - Keeping VitePress and external theme previews behaviorally aligned.
 *
 * Expects:
 * - A VitePress enhance-app context with a mutable Vue app instance.
 * - Theme-specific layouts and CSS to be registered by the caller.
 *
 * Returns:
 * - Nothing; registration mutates the Vue app instance.
 */
export function enhanceSharedDocsApp({ app }: EnhanceAppContext): void {
  const usePlugin = app.use as unknown as (plugin: unknown, ...options: unknown[]) => void

  app.component('IntegrationCard', IntegrationCard)
  app.component('HomeContent', HomeContent)
  app.component('ThumbhashPreview', ThumbhashPreview)

  usePlugin(TwoslashFloatingVue)
  usePlugin(MotionPlugin)
}
