import type { Helpers } from './helpers'
import type { Locale } from './locales'

export interface Context {
  helpers: Helpers
}

export interface GitChangelogMarkdownSectionOptions {
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
