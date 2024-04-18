# 配置 Vite 插件

除了 UI 组件，基于 Git 的页面历史记录还提供了另外两个 Vite 插件，用于数据获取和渲染。这两个插件分别是 `GitChangelog` 和 `GitChangelogMarkdownSection`。

### 配置 Vite 插件

<!--@include: @/pages/zh-CN/snippets/configure-tsconfig.md-->

#### `GitChangelog` 插件

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

但选项并不止于此。我们还有更多选项来配置插件，以满足您的需求。

::: details 完整选项

```typescript twoslash
import type {
  Commit, RewritePathsBy
} from '@nolebase/vitepress-plugin-git-changelog/vite'
// ---cut---
interface Options {
  /**
   * When fetching git logs, what directories should be included?
   */
  includeDirs?: string[]
  /**
   * Your repository URL.
   * Yes, you can dynamically generate it.
   *
   * @default 'https://github.com/example/example'
   */
  repoURL?: string | ((commit: Commit) => string)
  /**
   * A function to get the release tag URL.
   *
   * @default (commit) => `${commit.repo_url}/releases/tag/${commit.tag}`
   */
  getReleaseTagURL?: (commit: Commit) => string
  /**
   * A function to get the commit URL.
   *
   * @default (commit) => `${commit.repo_url}/commit/${commit.hash}`
   */
  getCommitURL?: (commit: Commit) => string
  /**
   * A map that contains rewrite rules of paths.
   *
   * This is quite useful when you have your pages in a different directory than the base url after deployed since the
   * data will be calculated again on the client side.
   *
   * For example:
   *  - We have a page at `docs/pages/en/integrations/page.md`
   *  - And we will deploy it to `https://example.com/en/integrations/page`
   *
   * Then you can set the rewrite paths like this:
   * ```json
   * {
   *  "docs/": ""
   * }
   * ```
   *
   * This will rewrite the path to `en/integrations/page.md`
   * Which is the correct path for the deployed page and runtime scripts to work properly.
   *
   * Note: in runtime, which is client side, the final extension will be replaced with `.md` if the extension is `.html`.
   */
  rewritePaths?: Record<string, string>
  /**
   * Rules to rewrite paths by patterns.
   *
   * Same as `rewritePaths`, but it can be a function that returns a promise or plain value.
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
   *
   */
  rewritePathsBy?: RewritePathsBy
  /**
   * The maximum number of git logs to fetch.
   */
  maxGitLogCount?: number
  /**
   * The maximum number of concurrent processes to fetch git logs.
   */
  maxConcurrentProcesses?: number
}
```

:::

#### `GitChangelogMarkdownSection` 插件

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

#### 国际化

`GitChangelogMarkdownSection` 插件支持国际化。你可以配置 `locales` 选项来提供章节标题的翻译：

::: tip 为什么又有国际化配置了？还是在 Vite 里面的？认真的？

VitePress 有一个名为[大纲](https://vitepress.dev/reference/default-theme-config#outline)的功能，它是通过读取一个页面中的所有标题然后基于此生成的侧边栏导航。
而为了能让页面历史和贡献者章节出现在大纲列表中，我们必须先将这些部分注入 Markdown，然后再交给 VitePress 渲染成 HTML

但是，与在 Vite 插件中直接操作或通过 Remark API 操作相比，在 `markdown-it` 的抽象语法树（AST）中操作 Markdown 会更加困难，不过这又是另一个话题了。

总之，我们必须在 Markdown 渲染成 HTML 之前，先将部分内容注入 Markdown，并提供国际化支持。

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

或者直接动态生成

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

#### 在 Markdown 页面层级将页面排除在 `GitChangelogMarkdownSection` 的转换之外

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

#### 全局地将某个页面排除在 `GitChangelogMarkdownSection` 的转换之外

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

#### 全局禁用页面历史或贡献者章节

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
