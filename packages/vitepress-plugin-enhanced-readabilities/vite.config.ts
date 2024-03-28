import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import Unocss from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import Yaml from '@rollup/plugin-yaml'

export default defineConfig({
  resolve: {
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
