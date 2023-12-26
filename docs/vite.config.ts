import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { ChangeLog } from '@nolebase/vitepress-plugin-changelog'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov', '**/*.mp4'],
    plugins: [
      UnoCSS(),
      ChangeLog(),
    ],
  }
})
