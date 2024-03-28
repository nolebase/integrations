import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import Yaml from '@rollup/plugin-yaml'

export default defineConfig({
  define: {
    // Preserve import.meta.hot for library dev builds · Issue #8921 · vitejs/vite
    // https://github.com/vitejs/vite/issues/8921
    // feat: allow import.meta.hot define override by doman412 · Pull Request #8944 · vitejs/vite
    // https://github.com/vitejs/vite/pull/8944
    'import.meta.hot': 'import.meta.hot',
  },
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
    outDir: 'dist/client',
    lib: {
      entry: 'src/client/index.ts',
      name: '@nolebase/vitepress-plugin-page-properties',
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
        'virtual:nolebase-page-properties',
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
