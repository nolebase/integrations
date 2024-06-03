# Migrate from `v1` to `v2`

The primary goal of the version update to `v2` is:

1. Update to VitePress `1.0.0`.
2. Enforce all packages and modules follow the same code structure, naming conventions, imports/exports pattern.

Therefore,

1. All the updated packages will not compatible with VitePress RC versions anymore.
2. All the updated packages will follow:
  - Exported entry file is `{packageName}/client` if it is a Vue component, Vue plugin, client side code, styles, etc.
  - Exported entry file is `{packageName}/locales` if it is a i18n module.
  - Exported entry file is `{packageName}/vitepress` if it is a VitePress specific plugin (e.g. build hook, `buildEnd`, `transformHTML`, etc.)
  - Exported entry file is `{packageName}/markdown-it` if it is a markdown-it plugin.
  - Exported entry file is `{packageName}/vite` if it is a Vite plugin.
3. All the updated packages will follow the same i18n guidelines across Nolebase packages.
4. All the updated packages will try to re-use their Vue components from `@nolebase/ui` package.

And breaking changes will be introduced, but with a migration guide, and less migration effort.

## Inline links previewing

There are some breaking changes in the `@nolebase/vitepress-plugin-inline-link-preview` plugin.

1. No longer require the use of `@nolebase/markdown-it-element-transform` package, the new `@nolebase/vitepress-plugin-inline-link-preview/markdown-it` plugin will export the needed markdown-it plugin as a function that exported from `@nolebase/vitepress-plugin-inline-link-preview/markdown-it`.
2. By following the new structure, the new `@nolebase/vitepress-plugin-inline-link-preview/client` will export the Vue component for the inline link previewing instead of the direct import from the package root.

### Remove `@nolebase/markdown-it-element-transform`

```json
{
  "devDependencies": {
    "@nolebase/markdown-it-element-transform": "^1.28.0" // [!code --]
  }
}
```

You can perform the following steps to remove the `@nolebase/markdown-it-element-transform` package:

::: code-group

```shell [@antfu/ni]
nun @nolebase/markdown-it-element-transform
```

```shell [pnpm]
pnpm uninstall @nolebase/markdown-it-element-transform
```

```shell [yarn]
yarn remove @nolebase/markdown-it-element-transform
```

```shell [npm]
npm uninstall @nolebase/markdown-it-element-transform
```

:::

### Update VitePress config to use the new markdown-it plugin exported from `@nolebase/vitepress-plugin-inline-link-preview/markdown-it`

You can now use

```ts
import { defineConfig } from 'vitepress'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it' // [!code ++]

export default defineConfig({
  // ...
  markdown: {
    // ...
    config: (md) => {
      // @ts-expect-error unmatched type for VitePress, ref https://github.com/nolebase/integrations/pull/228 [!code ++]
      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    },
  },
})
```

to replace the old way of using `@nolebase/markdown-it-element-transform`.

Full changes:

::: code-group

```ts [.vitepress/config.ts]
import { defineConfig } from 'vitepress'
import { ElementTransform } from '@nolebase/markdown-it-element-transform'
import type { Options as ElementTransformOptions } from '@nolebase/markdown-it-element-transform' // [!code --]
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it' // [!code ++]

export default defineConfig({
  // ...
  markdown: {
    // ...
    config: (md) => {
      md.use(ElementTransform, (() => {// [!code --]
        let transformNextLinkCloseToken = false// [!code --]
        // [!code --]
        return { // [!code --]
          transform(token) { // [!code --]
            switch (token.type) { // [!code --]
              case 'link_open': // [!code --]
                if (token.attrGet('class') !== 'header-anchor') { // [!code --]
                  token.tag = 'VPNolebaseInlineLinkPreview'// [!code --]
                  transformNextLinkCloseToken = true // [!code --]
                }
                // [!code --]
                break // [!code --]
              case 'link_close': // [!code --]
                if (transformNextLinkCloseToken) { // [!code --]
                  token.tag = 'VPNolebaseInlineLinkPreview' // [!code --]
                  transformNextLinkCloseToken = false // [!code --]
                } // [!code --]
                // [!code --]
                break // [!code --]
            } // [!code --]
          }, // [!code --]
        } as ElementTransformOptions // [!code --]
      })()) // [!code --]

      // @ts-expect-error unmatched type for VitePress, ref https://github.com/nolebase/integrations/pull/228 [!code ++]
      md.use(InlineLinkPreviewElementTransform) // [!code ++]
    },
  },
})
```

:::

### Update VitePress theme config to use the new Vue component exported from `@nolebase/vitepress-plugin-inline-link-preview/client`

Since all the Vue components are now exported from the `client` entry file, you can now use

```ts
import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview' // [!code --]
} from '@nolebase/vitepress-plugin-inline-link-preview/client' // [!code ++]
```

to replace the old way of using `@nolebase/vitepress-plugin-inline-link-preview`.

The same applies to the styles:

```ts
import '@nolebase/vitepress-plugin-inline-link-preview/dist/style.css' // [!code --]
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css' // [!code ++]
```

## Enhanced readabilities

There are some breaking changes in the `@nolebase/vitepress-plugin-enhanced-readabilities` plugin.

1. By following the new structure, the new `@nolebase/vitepress-plugin-enhanced-readabilities/client` will export the Vue components for the enhanced readabilities instead of the direct import from the package root.

### Update VitePress theme config to use the new Vue components exported from `@nolebase/vitepress-plugin-enhanced-readabilities/client`

Since all the Vue components are now exported from the `client` entry file, you can now use

```ts
import {
  InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
  LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'  // [!code --]
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'  // [!code ++]
```

to replace the old way of using `@nolebase/vitepress-plugin-enhanced-readabilities`.

The same applies to the styles:

```ts
import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'  // [!code --]
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'  // [!code ++]
```

## Highlight targeted heading

There are some breaking changes in the `@nolebase/vitepress-plugin-highlight-targeted-heading` plugin.

1. By following the new structure, the new `@nolebase/vitepress-plugin-highlight-targeted-heading/client` will export the Vue components for the highlight targeted heading instead of the direct import from the package root.

### Update VitePress theme config to use the new Vue components exported from `@nolebase/vitepress-plugin-highlight-targeted-heading/client`

Since all the Vue components are now exported from the `client` entry file, you can now use

```ts
import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading' // [!code --]
} from '@nolebase/vitepress-plugin-highlight-targeted-heading/client' // [!code ++]
```

to replace the old way of using `@nolebase/vitepress-plugin-highlight-targeted-heading`.

The same applies to the styles:

```ts
import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css' // [!code --]
import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css' // [!code ++]
```

## Git-based page histories

### UI config

1. `mapContributors` now deprecated, please use `mapAuthors` instead since it's more neutral for writers.
2. `nameAliases` now deprecated, please use `mapByNameAliases` instead, which is more clear and consistent with other plugins.
3. `emailAliases` now deprecated, please use `mapByEmailAliases` instead, which is more clear and consistent with other plugins.
4. Added new `username` field, which is the username of the author on GitHub used to fetch the avatar.
5. The `locales` in the original Vite plugin `GitChangelogMarkdownSection` no longer need to be configured and have been migrated to the UI configuration under `locales`:
	1. `changelog.title`
	2. `contributors.title`;
6. In order to better structure the organization of the i18n fields, the original
	1. `noLogs` i18n configuration changed to `changelog.noData`;
	2. `noContributors` i18n configuration was changed to `contributors.noData`.
	3. `lastEdited` i18n Configuration changed to `lastEdited`.
	4. `lastEditedDateFnsLocaleName` configuration changed to `changelog.lastEditedDateFnsLocaleName`
	5. `viewFullHistory` i18n Configuration changed to `changelog.viewFullHistory`
	6. `committedOn` i18n configuration changed to `changelog.committedOn`

### `Vite` config

1. There is no longer a need to configure the `locales` field for `GitChangelogMarkdownSection`, and all of the internationalized i18n configuration has been migrated to the UI configuration.
2. `includeDirs` and `includeExtensions` have been deprecated and merged into `include`, which is a list of glob modes with `!` negation.
3. If a renderable page file located outside of the VitePress root (where `.vitepress` lives), please configure the `cwd` (current working directory) to the parent directory of the page files. (For example, in a Monorepo, if the source file that rendered a page s located outside of `docs/`, you need to set `cwd` to the root directory of the Monorepo instead of the root of VitePress.)
4. No longer needed to configure `rewritePaths`, therefor `rewritePaths` is now deprecated, can be safely removed.
5. `rewritePathsBy` pattern should be configured in the against to filesystem paths, not the URL route paths.

## Previewing image (social media card) generation

There are some breaking changes in the `@nolebase/vitepress-plugin-og-image` plugin.

1. By following the new structure, the new `@nolebase/vitepress-plugin-og-image/vitepress` will export the VitePress specific plugin instead of the direct import from the package root.

### Update VitePress config to use the new VitePress specific plugin exported from `@nolebase/vitepress-plugin-og-image/vitepress`

You can now use

```ts
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image' // [!code --]
import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress' // [!code ++]
```

to replace the old way of using `@nolebase/vitepress-plugin-og-image`.

## Conclusion

1. Rewrite all the import paths to follow the new structure.
2. Remove the old packages that are no longer needed.

That's it! Nothing else were impacted for the migration from `v1` to `v2`.

We have improved the code structure, naming conventions, imports/exports pattern, and made the packages more consistent across the Nolebase ecosystem.
Happy writing! 🎉

See you next time in the `v3` migration guide!
