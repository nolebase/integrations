---
title: Git-based page histories
category: Git-based page histories
sidebarTitle: Configure Vite plugins
---

# Configure Vite plugins

::: danger Deprecating the `locales` field of `GitChangelogMarkdownSection` plugin options

We migrated the `locales` configurations to [UI config](/pages/en/integrations/vitepress-plugin-git-changelog/configure-ui#locales-options). You no longer need to set `locales` for `GitChangelogMarkdownSection` plugin.

For information, please refer to [Migrate from v1 to v2](/pages/en/releases/migrations/v1-to-v2).

:::

Besides the UI widget components, Git-based page histories offer another two Vite plugins for data fetching and rendering. These plugins are `GitChangelog` and `GitChangelogMarkdownSection`.

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

## Configure `GitChangelog` plugin

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

### Option `mapAuthors` - Map contributors' information

The `mapAuthors` field in the configuration options is used to map the contributors' information. You can provide the `mapAuthors` field in the configuration options to map the contributors' information, including the display name, avatar, email, social links, and aliases.

Let's say we have these logs:

```plaintext
commit 1
Author: John Doe <john.doe@example.com>
Date:   Fri Oct 1 12:00:00 2021 +0800

    Add a new feature

commit 2
Author: John Doe <john.doe@anothersite.com>

    Fix a bug
```

We now have two commits from the same person, with only the email address is different. By default, the plugin will treat them as two different contributors.
Such case happens when you changed your name or email address in the past.

To solve this, you can provide the `mapAuthors` field in the configuration options to map the contributors' information:

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
        // Fill in your repository URL here
        repoURL: () => 'https://github.com/nolebase/integrations',
        mapAuthors: [ // [!code focus]
          { // [!code focus]
            name: 'John Doe', // [!code focus]
            username: 'john_doe', // [!code focus]
            mapByEmailAliases: ['john.doe@anothersite.com'] // [!code focus]
          } // [!code focus]
        ] // [!code focus]
      }), // [!code focus]
      GitChangelogMarkdownSection(),
    ]
    // other vite configurations...
  }
})
```

### All options

But the options don't stop there. We have more options to configure the plugin to fit your needs.

::: details Full list of options

```typescript twoslash
import type {
  Author,
  CommitToStringHandler,
  CommitToStringsHandler,
  RewritePathsBy
} from '@nolebase/vitepress-plugin-git-changelog/vite'
// ---cut---
interface GitChangelogOptions {
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
   * Map authors
   */
  mapAuthors?: Author[]
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

## Configure `GitChangelogMarkdownSection` plugin

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
import type { Context } from '@nolebase/vitepress-plugin-git-changelog/vite'
// ---cut---
interface GitChangelogMarkdownSectionOptions {
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

### Excluding a page from the transformation of `GitChangelogMarkdownSection`

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

### Globally exclude a page from the transformation of `GitChangelogMarkdownSection`

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

### Globally disable the changelog or contributors section

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
