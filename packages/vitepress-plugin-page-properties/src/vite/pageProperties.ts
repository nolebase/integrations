import type { Plugin } from 'vite'
import type { PagePropertiesData } from '.'

const VirtualModuleID = 'virtual:nolebase-page-properties'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

export function PageProperties(): Plugin {
  return {
    name: '@nolebase/vitepress-plugin-page-properties',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        exclude: [
          '@nolebase/vitepress-plugin-page-properties/client',
        ],
      },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-page-properties',
        ],
      },
    }),
    resolveId(id) {
      if (id === VirtualModuleID)
        return ResolvedVirtualModuleId
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null

      const data: PagePropertiesData = {
        'pages/en/integrations/vitepress-plugin-page-properties/index.md': {
          wordCount: 1000,
          readingTime: 5,
        },
        'pages/zh-CN/integrations/vitepress-plugin-page-properties/index.md': {
          wordCount: 2000,
          readingTime: 10,
        },
      }
      return `export default ${JSON.stringify(data)}`
    },
  }
}
