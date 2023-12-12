import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@nolebase/vitepress-plugin-highlight-targeted-heading',
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
