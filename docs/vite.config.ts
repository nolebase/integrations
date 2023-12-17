import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      UnoCSS(),
    ],
  }
})
