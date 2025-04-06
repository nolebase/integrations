import type { Author } from '../types'
import type {
  CommitToStringHandler,
  CommitToStringsHandler,
  Helpers,
  RewritePathsBy,
} from './helpers'

export interface Context {
  helpers: Helpers
}

export interface GitChangelogOptions {
  /**
   * The current working directory in which to search files.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * When fetching git logs, what files should be included?
   *
   * @default ['**\/*.md', '!node_modules']
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

export interface GitChangelogMarkdownSectionOptions {
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
