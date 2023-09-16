// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import { NolebaseEnhancedReadabilitiesMenu } from '@nolebase/vitepress-plugin-enhanced-readabilities'

import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import './styles/vars.css'
import './styles/main.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
    })
  },
  enhanceApp() {
    // ...
  },
}
