import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import Unocss from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import Yaml from '@rollup/plugin-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  optimizeDeps: {
    include: [
      // @rive-app/canvas is a CJS/UMD module, so it needs to be included here
      // for Vite to properly bundle it.
      '@nolebase/ui > @rive-app/canvas',
    ],
  },
  resolve: {
    alias: {
      '@nolebase/ui': resolve(__dirname, '../ui/src/'),
    },
    dedupe: [
      'vue',
      'vitepress',
      '@vue/runtime-core',
    ],
  },
  plugins: [
    Vue(),
    Unocss(),
    Yaml() as unknown as Plugin,
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@nolebase/vitepress-plugin-enhanced-readabilities',
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'vitepress',
      ],
      output: {
        globals: {
          vue: 'Vue',
          vitepress: 'vitepress',
        },
      },
    },
  },
})
