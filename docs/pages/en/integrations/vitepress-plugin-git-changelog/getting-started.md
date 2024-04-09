# Getting started

::: warning 🚧 Constructing
Nice to meet you! But sorry, this page is still under construction. If you don’t find the information you are interested in, you can first find the content you are interested in in the navigation in the sidebar to start reading.
:::

This is roughly the most complex one to configure with.

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [
      GitChangelog({
        repoURL: () => 'https://github.com/nolebase/integrations',
        rewritePaths: {
          'docs/': '',
        },
      }),
      GitChangelogMarkdownSection({
        excludes: [
          join('pages', 'en', 'index.md'),
          join('pages', 'zh-CN', 'index.md'),
        ],
      }),
    ]
    // other vite configurations...
  }
})
```

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  InjectionKey as NolebaseGitChangelogInjectionKey, // [!code ++]
  NolebaseGitChangelogPlugin // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

import '@nolebase/vitepress-plugin-git-changelog/client/styles.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin, {  // [!code ++]
      mapContributors: [  // [!code ++]
        {  // [!code ++]
          name: 'Neko',  // [!code ++]
          avatar: 'https://github.com/nekomeowww.png',  // [!code ++]
          nameAliases: ['Neko Ayaka', 'Ayaka Neko'],  // [!code ++]
          emailAliases: ['neko@ayaka.moe'],  // [!code ++]
        },  // [!code ++]
        {  // [!code ++]
          name: 'Rizumu',  // [!code ++]
          avatar: 'https://github.com/LittleSound.png',  // [!code ++]
          nameAliases: ['Rizumu Ayaka', 'Ayaka Rizumu'],  // [!code ++]
          emailAliases: ['rizumu@ayaka.moe'],  // [!code ++]
        },  // [!code ++]
      ],  // [!code ++]
    })  // [!code ++]
  },
}

export default Theme
```

```typescript twoslash
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: [
        // @rive-app/canvas is a CJS/UMD module, so it needs to be included here
        // for Vite to properly bundle it.
        '@nolebase/vitepress-plugin-git-changelog > @nolebase/ui > @rive-app/canvas',
      ],
      exclude: [
        '@nolebase/vitepress-plugin-git-changelog/client',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-git-changelog',
        // @nolebase/ui required here as noExternal to avoid the following error:
        // TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".vue" for ...
        // Read more here: https://github.com/vuejs/vitepress/issues/2915
        // And here: https://stackblitz.com/edit/vite-gjz9zf?file=docs%2F.vitepress%2Fconfig.ts
        '@nolebase/ui',
      ],
    },
    // other vite configurations...
  }
})
```
