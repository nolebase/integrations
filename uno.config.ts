import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'nolebase-surface': 'bg-nolebase-surface text-nolebase-text',
      'nolebase-surface-soft': 'bg-nolebase-surface-soft text-nolebase-text',
      'nolebase-surface-elevated': 'bg-nolebase-surface-elevated text-nolebase-text',
      'nolebase-card': 'nolebase-surface-soft border border-nolebase-border rounded-nolebase-lg shadow-nolebase-card',
      'nolebase-popover': 'nolebase-surface-elevated border border-nolebase-border rounded-nolebase-xl shadow-nolebase-popover',
      'nolebase-brand-link': 'text-nolebase-brand hover:text-nolebase-brand',
      'nolebase-muted': 'text-nolebase-text-muted',
    },
  ],
  theme: {
    colors: {
      nolebase: {
        'surface': 'var(--nolebase-c-surface)',
        'surface-soft': 'var(--nolebase-c-surface-soft)',
        'surface-elevated': 'var(--nolebase-c-surface-elevated)',
        'text': 'var(--nolebase-c-text)',
        'text-muted': 'var(--nolebase-c-text-muted)',
        'border': 'var(--nolebase-c-border)',
        'brand': 'var(--nolebase-c-brand)',
        'warning': 'var(--nolebase-c-warning)',
        'danger': 'var(--nolebase-c-danger)',
      },
    },
    borderRadius: {
      'nolebase-sm': 'var(--nolebase-radius-sm)',
      'nolebase-md': 'var(--nolebase-radius-md)',
      'nolebase-lg': 'var(--nolebase-radius-lg)',
      'nolebase-xl': 'var(--nolebase-radius-xl)',
      'nolebase-full': 'var(--nolebase-radius-full)',
    },
    boxShadow: {
      'nolebase-card': 'var(--nolebase-shadow-card)',
      'nolebase-popover': 'var(--nolebase-shadow-popover)',
      'nolebase-focus': 'var(--nolebase-shadow-focus)',
    },
  },
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
    }),
    presetWebFonts({
      fonts: {
        'chakra-petch': ['Chakra Petch'],
        'baloo-2': [
          {
            name: 'Baloo 2',
          },
          {
            name: 'Noto Sans',
          },
          {
            name: 'Roboto',
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
        'jura': ['Jura'],
      },
    }),
  ],
})
