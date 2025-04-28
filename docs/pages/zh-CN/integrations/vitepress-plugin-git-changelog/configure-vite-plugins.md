---
title: 基于 Git 的页面历史
category: 基于 Git 的页面历史
sidebarTitle: 配置 Vite 插件
---

# 配置 Vite 插件

::: danger 弃用 `GitChangelogMarkdownSection` 插件选项的 `locales` 字段

我们将 `locales` 配置迁移到了 [配置 UI](/pages/zh-CN/integrations/vitepress-plugin-git-changelog/configure-ui#locales-options)。

您不再需要为 `GitChangelogMarkdownSection` 插件设置 `locales`。

有关具体的迁移信息，请参阅 [自 v1 迁移至 v2](/pages/zh-CN/releases/migrations/v1-to-v2)。

:::

除了 UI 组件，基于 Git 的页面历史记录还提供了另外两个 Vite 插件，用于数据获取和渲染。这两个插件分别是 `GitChangelog` 和 `GitChangelogMarkdownSection`。

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

## 配置 `GitChangelog` 插件

还记得我们第一次介绍 `GitChangelog` 插件时的这部分内容吗？

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

在 `GitChangelog` 插件中，您可以配置 `repoURL` 选项，使其指向您的 Git 仓库托管的 URL。这是插件正常工作的唯一必要选项。

### 选项 `mapContributors` - 为贡献者添加数据映射

配置选项中的 `mapContributors` 字段用于映射贡献者信息，可以用来将获取到的 Git 的日志信息中的包括名称和邮箱的贡献者信息映射为另一个贡献者。

如果我们假设有如下的 Git 日志：

```plaintext
commit 1
Author: John Doe <john.doe@example.com>
Date:   Fri Oct 1 12:00:00 2021 +0800

    Add a new feature

commit 2
Author: John Doe <john.doe@anothersite.com>

    Fix a bug
```

现在我们有两个来自同一个人的提交，只有电子邮件地址不同。在不进行任何配置的默认情况下，插件会将它们视为两个不同的贡献者。
这种情况通常是因为你或者其他贡献者更改了自己的电子邮件地址。

要解决这个问题，我们可以使用 `mapAuthors` 选项：

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

### 完整选项

但选项并不止于此。我们还有更多选项来配置插件，以满足您的需求。

::: details 完整选项

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

## 配置 `GitChangelogMarkdownSection` 插件

`GitChangelogMarkdownSection` 插件是一个在 Markdown 页面中注入章节的插件。可以与 `GitChangelog` 插件一起使用，以在页面中显示 Git 历史记录。

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

在幕后，这个插件的作用只是在你的 Markdown 页面中添加 `<NolebaseGitContributors />` 和 `<NolebaseGitChangelog />` 组件。

它确实有更多的配置选项。

::: details 完整选项

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

### 在 Markdown 页面层级将页面排除在 `GitChangelogMarkdownSection` 的转换之外

您可以通过在页面的 frontmatter 中添加 `nolebase.gitChangelog` 或 `gitChangelog` 配置，将页面排除在 `GitChangelogMarkdownSection` 转换之外：

```markdown
---
nolebase:
  gitChangelog: false
---
```

或者

```markdown
---
gitChangelog: false
---
```

都可以。

### 全局地将某个页面排除在 `GitChangelogMarkdownSection` 的转换之外

通过配置 `exclude` 选项，可以全局地将某个页面排除在 `GitChangelogMarkdownSection` 的转换之外：

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

### 全局禁用页面历史或贡献者章节

通过配置 `sections` 选项，可以在全局禁用页面历史或贡献者章节：

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
