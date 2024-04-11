import { defineConfig } from 'vitest/config'
import Yaml from '@rollup/plugin-yaml'
import type { Plugin } from 'vite'

export default defineConfig({
  plugins: [
    Yaml() as Plugin,
  ],
  test: {
    coverage: {
      reporter: ['json'],
    },
  },
})
