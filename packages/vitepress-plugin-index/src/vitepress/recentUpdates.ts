import { readFile } from 'node:fs/promises'
import { basename, join, relative, sep } from 'node:path'
import { sep as posixSep } from 'node:path/posix'
import { cwd } from 'node:process'

import grayMatter from 'gray-matter'

import { defu } from 'defu'
import { execa } from 'execa'
import { glob } from 'tinyglobby'

export interface FileEntry {
  title: string
  url: string
  lastUpdated: number
  category: string
  filePath: string
}

export interface RecentUpdatesContentLoaderOptionsCategory {
  /**
   * Automatically extract category text from path with a specific level.
   *
   * For example, if you have a path like `/foo/bar/baz/index.md`, and you set `byLevel` to `1`,
   * the category text will be `bar`. This is extremely useful when you have a file based routing,
   * while having all the contents organized in a stable directory structure (e.g. knowledge base).
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   */
  byLevel?: number
  /**
   * Automatically extract category text from path with a specific prefix.
   *
   * For example, if you have a path like `/foo/bar/baz/index.md`, and you set `byPathPrefix` to `[{ prefix: 'foo', text: 'Foo' }]`,
   * the category text will be `Foo`. This is extremely useful when you use file based routing, while organized the contents
   * inside a directory name that friendly to browsers.
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   */
  byPathPrefix?: {
    /**
     * The prefix to match.
     */
    prefix: string
    /**
     * The text to use as category.
     */
    text: string
  }[]
  /**
   * If `byLevel` or `byPathPrefix` is not enough, you can provide a custom getter to extract category text programmatically.
   *
   * For example you have a complex i18n system, or you want to extract category text from a specific field in frontmatter.
   *
   * As end user, either specify one of `byLevel`, `byPathPrefix`, or `byCustomGetter`, if multiple
   * options are provided, `byCustomGetter` would be used as the first priority. `byPathPrefix` secondary,
   * and `byLevel` as the last resort. If none of them are provided or produced undefined result for category
   * text, it will fallback to frontmatter category text.
   *
   * @param {FileEntry} page - The page item to process
   * @returns {string} The category text
   */
  byCustomGetter?: (page: FileEntry) => string | void | Promise<string | void>
  /**
   * Fallback to frontmatter category text when no category text found.
   *
   * Only effective when no category text found from `byLevel`, `byPathPrefix`, or `byCustomGetter`, or none of them
   * were provided. If `true`, it will fallback to frontmatter category text when no category text found. Otherwise a 'Un-categorized'
   * will be used as category text.
   *
   * @default true
   */
  fallbackWithFrontmatter?: boolean
}

export interface RecentUpdatesContentLoaderOptions {
  dir?: string
  rewrites?: Array<{ from: RegExp, to: string }>
  category?: RecentUpdatesContentLoaderOptionsCategory
  ignores?: string[]
}

export async function applyCategoryText(entryItem: FileEntry, categoryOptions?: RecentUpdatesContentLoaderOptionsCategory): Promise<string | void> {
  if (typeof categoryOptions?.byCustomGetter !== 'undefined') {
    const gotTextMaybePromise = categoryOptions.byCustomGetter({ ...entryItem })

    if (typeof gotTextMaybePromise !== 'undefined') {
      if (gotTextMaybePromise instanceof Promise)
        return await gotTextMaybePromise

      if (gotTextMaybePromise)
        return gotTextMaybePromise
    }
  }

  if (typeof categoryOptions?.byPathPrefix !== 'undefined') {
    for (const { prefix, text } of categoryOptions.byPathPrefix) {
      if (entryItem.filePath.split(sep).join(posixSep).startsWith(prefix)) {
        if (!text) {
          return
        }

        return text
      }
      if (entryItem.filePath.split(sep).join(posixSep).startsWith(`/${prefix}`)) {
        if (!text) {
          return
        }

        return text
      }
    }

    return
  }

  if (typeof categoryOptions?.byLevel !== 'undefined') {
    const level = Number.parseInt(String(categoryOptions?.byLevel ?? 0))
    if (Number.isNaN(level)) {
      return
    }

    const dirs = entryItem.filePath.split(sep)
    if (dirs.length > level)
      return dirs[level]
  }
}

function toggledFromFrontmatter(data: Record<string, any>, key: string, groupKey: string = 'nolebase'): boolean {
  if (groupKey in data && key in data[groupKey] && !data[groupKey][key])
    return false
  if (key in data && !data[key])
    return false

  return true
}

export async function applyCategoryTextWithFallback(entryItem: FileEntry, frontmatter: Record<string, any>, categoryOptions?: RecentUpdatesContentLoaderOptionsCategory): Promise<string> {
  const customText = await applyCategoryText(entryItem, categoryOptions)
  if (customText)
    return customText

  const fallbackWithFrontmatter = typeof categoryOptions?.fallbackWithFrontmatter === 'undefined'
    ? true
    : categoryOptions.fallbackWithFrontmatter

  if (fallbackWithFrontmatter
    && 'category' in frontmatter
    && frontmatter.category
    && typeof frontmatter.category === 'string'
  ) {
    return (frontmatter as { category?: string }).category ?? ''
  }

  return 'Un-categorized'
}

export function createRecentUpdatesLoader(options?: RecentUpdatesContentLoaderOptions) {
  const opts = defu(options, {
    dir: '',
    rewrites: [],
  })

  return {
    async load() {
      const files = await glob(join(opts.dir, '**/*.md').replaceAll('\\', '/'), {
        absolute: true,
        cwd: cwd(),
        ignore: opts.ignores,
      })

      const updates: {
        title: string
        url: string
        lastUpdated: number
        category: string
        filePath: string
      }[] = []

      for (const file of files) {
        const { stdout } = await execa('git', ['log', `--format="%at"`, '-1', '--follow', '--', file])
        const output = stdout.replaceAll('"', '').trim()

        let lastUpdatedTimestamp = Number.parseInt(output || '0')
        if (Number.isNaN(lastUpdatedTimestamp)) {
          lastUpdatedTimestamp = 0
        }

        lastUpdatedTimestamp *= 1000 // to UNIX milliseconds

        const markdownFileContent = await readFile(file, 'utf-8')
        const { data, content } = grayMatter(markdownFileContent)

        if (!toggledFromFrontmatter(data, 'index', 'nolebase') && !toggledFromFrontmatter(data, 'recentUpdates', 'nolebase')) {
          continue
        }

        if (typeof data.lastUpdated !== 'undefined') {
          lastUpdatedTimestamp = (new Date(data.lastUpdated)).getTime()
        }

        let title = basename(file).replace(/\.md$/, '')
        if (typeof data.title !== 'undefined') {
          title = data.title
        }
        if (typeof title === 'undefined') {
          const matches = /^#\s+.+/.exec(content)
          if (matches) {
            title = matches[0]
          }
        }

        let url = ''
        const fileRelativePath = relative(cwd(), file)

        if (fileRelativePath.endsWith('.md')) {
          if (fileRelativePath.endsWith('index.md')) {
            url = fileRelativePath.replace(/index\.md$/, 'index.html')
          }
          else {
            url = fileRelativePath.replace(/\.md$/, '.html')
          }
        }

        for (const rewrite of opts.rewrites) {
          url = url.replace(rewrite.from, rewrite.to)
        }
        url = `/${url}`

        const entry = {
          title,
          lastUpdated: lastUpdatedTimestamp,
          filePath: fileRelativePath,
          category: '',
          url,
        }

        entry.category = await applyCategoryTextWithFallback(entry, data, opts.category)
        updates.push(entry)
      }

      return updates.sort((a, b) => b.lastUpdated - a.lastUpdated)
    },
  }
}
