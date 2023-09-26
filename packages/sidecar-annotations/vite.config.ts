import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    dedupe: [
      'vue',
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
      name: '@nolebase/sidecar-annotations',
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
