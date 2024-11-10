import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

export default createRecentUpdatesLoader({
  dir: 'pages/en',
  rewrites: [
    { from: /^pages\/en\//, to: '' },
  ],
  ignores: [
    '**/snippets/**.md',
  ],
})
