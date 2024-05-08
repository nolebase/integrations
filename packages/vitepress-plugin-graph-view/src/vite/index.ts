import type { Plugin } from 'vite'

export function GraphViewData(): Plugin {
  return {
    name: '@nolebase/vitepress-plugin-graph-view',
    enforce: 'pre',
    config() {
      return {
        optimizeDeps: {
          exclude: [
            '@nolebase/vitepress-plugin-graph-view/client',
          ],
        },
        ssr: {
          noExternal: [
            '@nolebase/vitepress-plugin-graph-view',
          ],
        },
      }
    },
  }
}
