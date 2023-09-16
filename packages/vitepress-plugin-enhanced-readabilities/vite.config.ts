import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

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
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vitepress-plugin-nolebase-enhanced-readabilities',
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
