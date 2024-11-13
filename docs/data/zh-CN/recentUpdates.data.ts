import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

export default createRecentUpdatesLoader({
  dir: 'pages/zh-CN',
  rewrites: [
    { from: /^pages\/zh-CN\//, to: '' },
  ],
  ignores: [
    '**/snippets/**.md',
  ],
})
