import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno({
      dark: 'class',
    }),
    presetAttributify(),
    presetIcons({
      prefix: 'i-',
      scale: 1.2, // size: 1.2 rem
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'min-width': '1.2rem',
      },
      warn: true,
      autoInstall: true,
    }),
    presetWebFonts({
      fonts: {
        'chakra-petch': ['Chakra Petch'],
        'baloo-2': ['Baloo 2'],
        'jura': ['Jura'],
      },
    }),
  ],
})
