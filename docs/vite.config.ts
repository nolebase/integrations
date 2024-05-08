import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from 'node:process'

import { readFile, stat } from 'node:fs/promises'
import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import Yaml from '@rollup/plugin-yaml'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'
import { cyan, gray, red } from 'colorette'

function getVueProdHydrationMismatchDetailsFlag() {
  if (!env) {
    console.warn('WARNING: env is not available when trying to get Vue Prod Hydration Mismatch Details Flag')
    throw new Error('env is not available')
  }

  return !!env.VUE_PROD_HYDRATION_MISMATCH_DETAILS_FLAG
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function OmitReplacing(omit: string, actualModulePath: string, options?: {
  doNotOmitIfActualModulePathExists?: boolean
}): Plugin {
  const moduleName = `@nolebase/vite-plugin-omit-replacing`
  const logModulePrefix = `${cyan(moduleName)}${gray(':')}`

  let config: ResolvedConfig
  const virtualOmittedModuleId = `virtual:@nolebase/vite-plugin-omit-replacing-${omit}`
  const resolvedOmittedModuleId = `\0${virtualOmittedModuleId}`

  const {
    doNotOmitIfActualModulePathExists = true,
  } = options || {}

  async function exists(path: string) {
    try {
      const res = await stat(path)
      if (!res.isFile())
        throw new Error(`the actual module path "${path}" is not a file`)

      return true
    }
    catch (error) {
      if (!(error instanceof Error))
        throw new Error(`an error occurred when calling stat over "${path}", returned error is not a instance of Error, ${error}`)

      if (!('code' in error))
        throw new Error(`an error occurred when calling stat over "${path}", "code" property is not in the error, ${error.message}`)

      if (error.code !== 'ENOENT')
        throw new Error(`an error occurred when calling stat over "${path}", ${error.message}`)

      return false
    }
  }

  return {
    name: '@nolebase/vite-plugin-omit-replacing',
    async config(): Promise<void | Omit<UserConfig, 'plugins'>> {
      if (doNotOmitIfActualModulePathExists) {
        try {
          const isExists = await exists(actualModulePath)
          if (isExists) {
            // eslint-disable-next-line no-console
            console.log(`${logModulePrefix}: the actual module path "${actualModulePath}" exists, will not omit the module "${omit}"`)
            return {
              resolve: {
                alias: [
                  {
                    find: omit,
                    replacement: actualModulePath,
                  },
                ],
              },
            }
          }
        }
        catch (error) {
          console.error(`${logModulePrefix} ${red(`[ERROR]`)}: an error occurred while checking the actual module path "${actualModulePath}", ${error}`)
          throw error
        }
      }

      return {
        resolve: {
          alias: [
            {
              find: omit,
              replacement: virtualOmittedModuleId,
            },
          ],
        },
      }
    },
    configResolved(c) {
      config = c
    },
    resolveId(id) {
      if (id === virtualOmittedModuleId) {
        if (config.mode !== 'development')
          return omit
        if (config.mode === 'development')
          return resolvedOmittedModuleId
      }
    },
    load(id) {
      if (id === omit)
        return readFile(actualModulePath, 'utf-8')
      if (id === resolvedOmittedModuleId)
        return ''
    },
  }
}

export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: getVueProdHydrationMismatchDetailsFlag(),
  },
  assetsInclude: [
    '**/*.mov',
    '**/*.mp4',
    '**/*.riv',
    '**/*.cast',
  ],
  optimizeDeps: {
    exclude: [
      'vitepress',
    ],
  },
  resolve: {
    alias: {
      '~/packages': resolve(__dirname, '../packages'),
      '@nolebase/ui': resolve(__dirname, '../packages/ui/src/'),
      '@nolebase/unconfig-vitepress': resolve(__dirname, '../packages/unconfig-vitepress/src/'),
      '@nolebase/vitepress-plugin-enhanced-readabilities': resolve(__dirname, '../packages/vitepress-plugin-enhanced-readabilities/src/'),
      '@nolebase/vitepress-plugin-highlight-targeted-heading': resolve(__dirname, '../packages/vitepress-plugin-highlight-targeted-heading/src/'),
      '@nolebase/vitepress-plugin-inline-link-preview': resolve(__dirname, '../packages/vitepress-plugin-inline-link-preview/src/'),
      '@nolebase/vitepress-plugin-git-changelog': resolve(__dirname, '../packages/vitepress-plugin-git-changelog/src/'),
      '@nolebase/vitepress-plugin-graph-view': resolve(__dirname, '../packages/vitepress-plugin-graph-view/src/'),
      '@nolebase/vitepress-plugin-page-properties': resolve(__dirname, '../packages/vitepress-plugin-page-properties/src/'),
      '@nolebase/vitepress-plugin-thumbnail-hash': resolve(__dirname, '../packages/vitepress-plugin-thumbnail-hash/src'),
    },
  },
  plugins: [
    OmitReplacing('@nolebase/ui/style.css', resolve(__dirname, '../packages/ui/dist/style.css')),
    Yaml() as Plugin,
    GitChangelog({
      maxGitLogCount: 2000,
      repoURL: () => 'https://github.com/nolebase/integrations',
    }),
    GitChangelogMarkdownSection({
      locales: {
        'zh-CN': {
          gitChangelogMarkdownSectionTitles: {
            changelog: '文件历史',
            contributors: '贡献者',
          },
        },
        'en': {
          gitChangelogMarkdownSectionTitles: {
            changelog: 'File History',
            contributors: 'Contributors',
          },
        },
      },
      excludes: [
        join('pages', 'en', 'index.md'),
        join('pages', 'zh-CN', 'index.md'),
      ],
    }),
    PageProperties(),
    PagePropertiesMarkdownSection({
      excludes: [
        join('pages', 'en', 'index.md'),
        join('pages', 'zh-CN', 'index.md'),
      ],
    }),
    ThumbnailHashImages(),
    Inspect({
      build: true,
      outputDir: '.vite-inspect',
    }),
    UnoCSS(),
  ],
})
