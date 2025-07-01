import type { Plugin } from 'vite'

import Yaml from '@rollup/plugin-yaml'

import { defineConfig } from 'vitest/config'

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
