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
    outDir: 'dist/client',
    lib: {
      entry: 'src/client/index.ts',
      name: '@nolebase/vitepress-plugin-git-changelog',
      fileName: format => format === 'es' ? 'index.mjs' : 'index.cjs',
      formats: [
        'es',
        'cjs',
      ],
    },
    rollupOptions: {
      external: [
        'vue',
        'vitepress',
        'virtual:nolebase-git-changelog',
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
