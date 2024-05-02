# Configure Vite plugins

Besides the UI widget components, Git-based page histories offer another two Vite plugins for data fetching and rendering. These plugins are `GitChangelog` and `GitChangelogMarkdownSection`.

### Configure Vite plugins

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

#### `GitChangelog` plugin

Remember this part back at the time where we first introduced the `GitChangelog` plugin?

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig(() => {
  return {
    plugins: [
      GitChangelog({ // [!code focus]
        // Fill in your repository URL here // [!code focus]
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code focus]
      }), // [!code focus]
      GitChangelogMarkdownSection(),
    ]
    // other vite configurations...
  }
})
```

In the `GitChangelog` plugin, you can configure the `repoURL` option to point to your repository URL. This is the only required option for the plugin to work properly.

But the options don't stop there. We have more options to configure the plugin to fit your needs.

::: details Full list of options

```typescript twoslash
import type {
  Commit, CommitToStringHandler, CommitToStringsHandler, RewritePathsBy
} from '@nolebase/vitepress-plugin-git-changelog/vite'
// ---cut---
interface Options {
    /**
   * The current working directory in which to search files.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * When fetching git logs, what files should be included?
   *
   * @default ['** /*.md', '!node_modules']
   */
  include?: string[]
  /**
   * Your repository URL.
   * Yes, you can dynamically generate it.
   *
   * @default 'https://github.com/example/example'
   */
  repoURL?: string | CommitToStringHandler
  /**
   * A function to get the release tag URL.
   *
   * @default (commit) => `${commit.repo_url}/releases/tag/${commit.tag}`
   */
  getReleaseTagURL?: CommitToStringHandler
  /**
   * A function to get the release tags URL.
   *
   * @default (commit) => commit.tags?.map(tag => `${commit.repo_url}/releases/tag/${tag}`)
   */
  getReleaseTagsURL?: CommitToStringsHandler
  /**
   * A function to get the commit URL.
   *
   * @default (commit) => `${commit.repo_url}/commit/${commit.hash}`
   */
  getCommitURL?: CommitToStringHandler
  /**
   * Rules to rewrite paths by patterns.
   *
   * This can be quite useful when your pages are in different directories,
   * or when they are generated at runtime according to path.ts.
   *
   * Since the plugin matches the git information for each page by comparing the local path,
   * you can override the local file path to `vitepress.useData.page.value.filePath` with this option.
   *
   * @example
   *
   * ```typescript
   * GitChangelog({
   *   rewritePathsBy: {
   *     handler: (_commit, path) => {
   *       if (path) {
   *         // path: packages/characters/src/lib1.ts
   *         if (path.startsWith('packages/characters/src/') && !path.includes('index.ts'))
   *           return `${path.replace('packages/characters/src/', '').slice(0, -3)}.md`
   *       }
   *       return path
   *     },
   *   },
   * })
   * ```
   *
   * Besides that, we offer some built-in handlers to rewrite paths by patterns:
   *
   *  - `rewritePathsByRewritingExtension(from: string, to: string)`: to rewrite paths by rewriting the extension.
   *
   * @example
   *
   * ```typescript
   * import { GitChangelog, rewritePathsByRewritingExtension } from '@nolebase/vitepress-plugin-git-changelog/vite'
   *
   * GitChangelog({
   *  rewritePathsBy: {
   *   // to rewrite `example.md` to `example.html`
   *  handler: rewritePathsByRewritingExtension('.md', '.html')
   * }
   * })
   * ```
   *
   * @see rewritePathsByRewritingExtension
   */
  rewritePathsBy?: RewritePathsBy
  /**
   * The maximum number of git logs to fetch.
   */
  maxGitLogCount?: number
}
```

:::

#### `GitChangelogMarkdownSection` plugin

The `GitChangelogMarkdownSection` plugin is a plugin that helps you to inject the Markdown sections into your VitePress pages. It's a plugin that works with the `GitChangelog` plugin to provide the data for the Markdown sections.

```typescript twoslash
import { defineConfig } from 'vite'
import { // [!code focus]
  GitChangelogMarkdownSection, // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code focus]

export default defineConfig({
  plugins: [
    GitChangelogMarkdownSection(), // [!code focus]
  ],
  // other vite configurations...
})
```

Behind the scene, what this plugin does it simply appending `<NolebaseGitContributors />` and `<NolebaseGitChangelog />` components to your Markdown pages.

It does have more options to configure.

::: details Full list of options

```typescript twoslash
import type { Context, Locale } from '@nolebase/vitepress-plugin-git-changelog/vite'
// ---cut---
interface GitChangelogMarkdownSectionOptions {
  /**
   * The locales options
   */
  locales?: Record<string, Locale>
  /**
   * The getter function to get the title of the changelog section
   *
   * @param code - raw markdown code (comes from vite when transform hook is called)
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns string
   * @default () => 'Changelog'
   */
  getChangelogTitle?: (code: string, id: string, context: Context) => string
  /**
   * The getter function to get the title of the contributors section
   *
   * @param code - raw markdown code (comes from vite when transform hook is called)
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns string
   * @default () => 'Contributors'
   */
  getContributorsTitle?: (code: string, id: string, context: Context) => string
  /**
   * The list of file names to exclude from the transformation
   *
   * @default ['index.md']
   */
  excludes?: string[]
  /**
   * The function to exclude the file from the transformation
   *
   * @param id - the current transforming module ID (comes from vite when transform hook is called)
   * @param context - the context object, contains several helper functions
   * @returns boolean
   * @default () => false
   */
  exclude?: (id: string, context: Context) => boolean
  /**
   * The sections options
   */
  sections?: {
    /**
     * Whether to disable the changelog section
     */
    disableChangelog?: boolean
    /**
     * Whether to disable the contributors section
     */
    disableContributors?: boolean
  }
}
```

:::

#### Internationalization

The `GitChangelogMarkdownSection` plugin supports internationalization. You can configure the `locales` option to provide the translations for the section titles.

::: tip Why internationalization again, in Vite plugin, seriously?

VitePress has a function called [outline](https://vitepress.dev/reference/default-theme-config#outline), where it read all the heading titles in one page and generate the sidebar navigation based on these data.

So in order to make the changelog (page history) and contributors section titles to be included into outline, we have to inject them into the Markdown before it got rendered into HTML, then pass them to VitePress to render the pages into HTML.

And transforming and manipulating `markdown-it` AST tree is a tough work to do by comparing to directly manipulate them in Vite plugins, or through Remark API, but this would be another story for another time.

In conclusion, we have to inject the sections into the Markdown before it got rendered into HTML, as well as the internationalization support.

:::

```typescript twoslash
import { defineConfig } from 'vite'
import { // [!code focus]
  GitChangelogMarkdownSection, // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code focus]

export default defineConfig({
  plugins: [
    GitChangelogMarkdownSection({ // [!code focus]
      locales: { // [!code focus]
        'zh-CN': { // [!code focus]
          gitChangelogMarkdownSectionTitles: { // [!code focus]
            changelog: '文件历史', // [!code focus]
            contributors: '贡献者', // [!code focus]
          }, // [!code focus]
        }, // [!code focus]
        'en': { // [!code focus]
          gitChangelogMarkdownSectionTitles: { // [!code focus]
            changelog: 'File History', // [!code focus]
            contributors: 'Contributors', // [!code focus]
          }, // [!code focus]
        }, // [!code focus]
      }, // [!code focus]
    }), // [!code focus]
  ],
  // other vite configurations...
})
```

or if you would like to dynamically generate the translations:

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code focus]
  GitChangelogMarkdownSection, // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code focus]

export default defineConfig({
  plugins: [
    GitChangelogMarkdownSection({ // [!code focus]
      getChangelogTitle: (_, __, { helpers }): string => {
        if (helpers.idStartsWith(join('pages', 'en')))
          return 'File History'
        if (helpers.idStartsWith(join('pages', 'zh-CN')))
          return '文件历史'

        return 'File History'
      },
      getContributorsTitle: (_, __, { helpers }): string => {
        if (helpers.idStartsWith(join('pages', 'en')))
          return 'Contributors'
        if (helpers.idStartsWith(join('pages', 'zh-CN')))
          return '贡献者'

        return 'Contributors'
      },
    }), // [!code focus]
  ],
  // other vite configurations...
})
```

#### Excluding a page from the transformation of `GitChangelogMarkdownSection`

You can exclude a page from the transformation of `GitChangelogMarkdownSection` by adding the `nolebase.gitChangelog` or `gitChangelog` frontmatter to the page:

```markdown
---
nolebase:
  gitChangelog: false
---
```

or

```markdown
---
gitChangelog: false
---
```

#### Globally exclude a page from the transformation of `GitChangelogMarkdownSection`

You can globally exclude a page from the transformation of `GitChangelogMarkdownSection` by configuring the `exclude` option:

```typescript twoslash
import { defineConfig } from 'vite'
import { // [!code focus]
  GitChangelogMarkdownSection, // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code focus]

export default defineConfig({
  plugins: [
    GitChangelogMarkdownSection({ // [!code focus]
      exclude: (id) => id.endsWith('index.md'), // [!code focus]
    }), // [!code focus]
  ],
  // other vite configurations...
})
```

#### Globally disable the changelog or contributors section

You can globally disable the changelog or contributors section by configuring the `sections` option:

```typescript twoslash
import { defineConfig } from 'vite'
import { // [!code focus]
  GitChangelogMarkdownSection, // [!code focus]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code focus]

export default defineConfig({
  plugins: [
    GitChangelogMarkdownSection({ // [!code focus]
      sections: { // [!code focus]
        disableChangelog: true, // [!code focus]
        disableContributors: true, // [!code focus]
      }, // [!code focus]
    }), // [!code focus]
  ],
  // other vite configurations...
})
```
