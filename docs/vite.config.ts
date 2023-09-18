import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      UnoCSS(),
    ],
  }
})
