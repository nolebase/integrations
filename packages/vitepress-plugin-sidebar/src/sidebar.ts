import type { DefaultTheme } from 'vitepress'

import {
  existsSync,
  readFileSync,
  statSync,
} from 'node:fs'
import {
  basename,
  extname,
  join,
} from 'node:path'
import { cwd } from 'node:process'

import GrayMatter from 'gray-matter'

import { globSync } from 'tinyglobby'

interface MenuItem {
  index: string
  text: string
  link?: string
  lastUpdated?: number
  collapsible?: boolean
  collapsed?: boolean
  items?: MenuItem[]
  category?: string
}

function isDirectory(path: string) {
  try {
    const res = statSync(path)
    return res.isDirectory()
  }
  catch {
    return false
  }
}

function directoryTitleFromPath(path: string) {
  const possibleTitleFromFiles = [
    'index.md',
    '_page.md',
  ]

  let title = ''

  for (const file of possibleTitleFromFiles) {
    if (!existsSync(join(path, file)))
      continue

    const fileContent = readFileSync(join(path, file), 'utf-8')
    const { content, data } = GrayMatter(fileContent)

    if (!title && data?.sidebarTitle) {
      title = data.sidebarTitle
    }
    if (!title && data?.title) {
      title = data.title
    }

    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const matchRes = content.match(/^#\s+(.*)$/m)?.[1]
    if (!title && matchRes) {
      title = matchRes.trim() // Trim potential whitespace
    }
  }

  if (!title)
    return basename(path)

  return title
}

function directoryCollapsedFromPath(path: string): boolean | undefined {
  const possibleTitleFromFiles = [
    'index.md',
    '_page.md',
  ]

  let collapsed = true

  for (const file of possibleTitleFromFiles) {
    if (!existsSync(join(path, file)))
      continue

    const fileContent = readFileSync(join(path, file), 'utf-8')
    const { data } = GrayMatter(fileContent)

    if (data?.sidebarCollapsed != null) {
      collapsed = Boolean(data.sidebarCollapsed)
    }
  }

  return collapsed
}

// Add this function to check if a page should be hidden from sidebar
function shouldHideFromSidebar(path: string): boolean {
  try {
    if (existsSync(path)) {
      const fileContent = readFileSync(path, 'utf-8')
      const { data } = GrayMatter(fileContent)
      return data?.sidebarHide === true
    }
    return false
  }
  catch (e) {
    console.error(`Error reading or parsing file: ${path}`, e)
    return false
  }
}

/**
 * Extracts the title from a Markdown file.
 * Priority: frontmatter.sidebarTitle > frontmatter.title > first H1 > filename.
 * @param path Absolute path to the Markdown file.
 * @returns The extracted title string, or null if the file doesn't exist.
 */
function titleFromPage(path: string): string {
  const titleFromFilename = basename(path, extname(path))
  let title = ''

  try {
    if (existsSync(join(cwd(), path))) {
      const fileContent = readFileSync(join(cwd(), path), 'utf-8')
      const { content, data } = GrayMatter(fileContent)

      if (!title && data?.sidebarTitle) {
        title = data.sidebarTitle
      }
      if (!title && data?.title) {
        title = data.title
      }

      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const matchRes = content.match(/^#\s+(.*)$/m)?.[1]
      if (!title && matchRes) {
        title = matchRes.trim() // Trim potential whitespace
      }
    }

    if (!title) {
      title = titleFromFilename
    }

    return title
  }
  catch (e) {
    console.error(`Error reading or parsing file: ${path}`, e)
    // Fallback to raw filename on error
    return basename(path, extname(path))
  }
}

export function listPages(options: { targets?: Array<string | { folderName: string, separate: boolean }>, ignore?: string[] }) {
  const { targets = [], ignore = [] } = options

  const files = globSync(`**/*.md`, {
    cwd: cwd(),
    ignore: [
      '_*',
      '**/_page.md',
      'dist',
      'node_modules',
      ...ignore,
    ],
    onlyFiles: true,
  })

  files.sort()

  return files.filter((file) => {
    return targets.some(target => file.startsWith(folderNameFromTargetConfig(target)))
  })
}

function folderNameFromTargetConfig(target: string | { folderName: string, separate: boolean }) {
  return typeof target === 'string' ? target : target.folderName
}

function separateFromTargetConfig(target: string | { folderName: string, separate: boolean }) {
  return typeof target === 'string' ? false : target.separate
}

function addRouteItem(indexes: MenuItem[], path: string, base?: string) {
  // Skip adding this item if it should be hidden
  if (shouldHideFromSidebar(path)) {
    return indexes
  }

  const title = titleFromPage(path)
  const suffixIndex = path.lastIndexOf('.')

  const item: MenuItem = {
    index: title,
    text: title,
    link: `/${path.slice(0, suffixIndex)}`,
  }

  let linkItems = item.link?.split('/') ?? []
  linkItems = linkItems.slice(1)

  if (linkItems.length === 1)
    return

  if (base) {
    const baseItems = base.split('/').filter(Boolean)
    linkItems = linkItems.slice(baseItems.length)
  }

  indexes = addRouteItemRecursion(indexes, item, linkItems, [], item.link)
}

function addRouteItemRecursion(indexes: MenuItem[], item: MenuItem, path: string[], parentPath: string[], fullLink?: string, upgradeIndex = false) {
  if (path.length === 1) {
    indexes.push(item)
    return indexes
  }
  else {
    const onePath = path.shift()
    if (!onePath)
      return indexes

    parentPath.push(onePath)
    const currentPath = join(cwd(), ...parentPath)

    let obj = indexes.find(obj => obj.index === onePath)

    if (!obj) {
      // If not found, create a new one
      // Check for collapse status in directory index files
      let collapsed: boolean | undefined = true

      if (isDirectory(currentPath)) {
        collapsed = directoryCollapsedFromPath(currentPath) ?? true
      }

      obj = { index: onePath, text: onePath, collapsed, items: [] }
      indexes.push(obj)
    }
    else if (!obj.items) {
      // If found, but no items, create a new one
      // with collapsed status from frontmatter if available
      let collapsed = true

      if (isDirectory(currentPath)) {
        collapsed = directoryCollapsedFromPath(currentPath) ?? true
      }

      obj.collapsed = collapsed
      obj.items = []
    }

    if (path.length === 1 && path[0] === 'index') {
      // If there is only one element, and it is index.md, write link directly.
      obj.link = item.link

      if (parentPath.includes(onePath) && isDirectory(join(cwd(), ...parentPath))) {
        const title = directoryTitleFromPath(join(cwd(), ...parentPath))
        obj.text = title
      }
    }
    else {
      if (parentPath.includes(onePath) && isDirectory(join(cwd(), ...parentPath))) {
        const title = directoryTitleFromPath(join(cwd(), ...parentPath))
        obj.text = title
      }

      // Otherwise, continue to add recursively
      obj.items = addRouteItemRecursion(obj.items ?? [], item, path, parentPath, fullLink, upgradeIndex)
    }

    return indexes
  }
}

export function processSidebar(docs: string[], base?: string) {
  const sidebar: MenuItem[] = []

  docs.map(async (docPath: string) => {
    addRouteItem(sidebar, docPath, base)
  })

  return sidebar
}

function articleTreeSort(articleTree: MenuItem[]) {
  articleTree.sort((itemA, itemB) => {
    return itemA.text.localeCompare(itemB.text)
  })
  return articleTree
}

function sidebarSort(sidebar: MenuItem[], folderTop: boolean = true) {
  let _sideBar
  if (folderTop) {
    // Separate out direct files and nested folders
    const files = articleTreeSort(sidebar.filter((item) => {
      return !item.items || item.items.length === 0
    }))
    const folders = articleTreeSort(sidebar.filter((item) => {
      return item.items && item.items.length > 0
    }))
    // Then merge into a new array when sorting is complete
    _sideBar = [...folders, ...files]
  }
  else {
    _sideBar = articleTreeSort(sidebar)
  }

  // If there are submenus, recursively sort each submenu.
  for (const articleTree of _sideBar) {
    if (articleTree.items && articleTree.items.length > 0)
      articleTree.items = sidebarSort(articleTree.items, folderTop)
  }
  return _sideBar
}

/**
 * Skips a specified number of leading directory levels in a sidebar array,
 * only if each level to be skipped contains exactly one directory item.
 *
 * @param sidebar The sidebar array (MenuItem[]) to process.
 * @param levels The number of levels to skip.
 * @returns The sidebar array starting from the desired level, or the original/deepest possible if skipping is not possible.
 */
function skipSidebarLevels(sidebar: MenuItem[], levels: number): MenuItem[] {
  let currentSidebar = sidebar
  let skippedCount = 0

  // Ensure levels is a positive integer
  const levelsToSkip = Math.max(0, Math.floor(levels))

  while (skippedCount < levelsToSkip) {
    // Check if we can skip the current level:
    // - Must have exactly one item.
    // - That item must be a directory (i.e., have an 'items' array).
    if (
      currentSidebar.length === 1
      && currentSidebar[0].items // Check if it's potentially a directory
      && Array.isArray(currentSidebar[0].items) // Ensure 'items' is an array
    ) {
      // Move down one level
      currentSidebar = currentSidebar[0].items
      skippedCount++
    }
    else {
      // Cannot skip further (either empty, multiple items, or the single item is not a directory)
      break
    }
  }

  return currentSidebar
}

export function mergeSidebar(
  targets: Array<string | { folderName: string, separate: boolean }>,
  docs: string[],
  base?: string,
  skipLevelsConfig?: Record<string, number>,
): DefaultTheme.SidebarItem[] | DefaultTheme.SidebarMulti {
  let sidebar = processSidebar(docs, base)
  sidebar = sidebarSort(sidebar, true)

  let isSingleOptimized = false
  let singleOptimizedSidebar: MenuItem[] | undefined

  if (sidebar.length === 1 && targets.some((item) => {
    const folderName = folderNameFromTargetConfig(item)
    // Compare index (folder name segment) instead of text which might come from _page.md/index.md
    return base ? folderName.endsWith(`/${sidebar[0].index}`) : folderName === sidebar[0].index
  })) {
    singleOptimizedSidebar = sidebar[0].items ?? []
    isSingleOptimized = true
    // If optimized, the effective 'base' for skipping might be considered '/'
    // We'll handle this after the multi-sidebar logic for simplicity.
  }

  const basePrefix = base ? `/${base}` : ''
  // Initialize with the potentially single-optimized sidebar or the full one
  const sidebarMultiple: Record<string, MenuItem[]> = {
    [`${basePrefix}/`]: isSingleOptimized ? singleOptimizedSidebar! : sidebar,
  }

  // If not single-optimized, handle separate targets
  if (!isSingleOptimized) {
    const rootSidebar = [...sidebar] // Work on a copy of the original full sidebar

    for (const target of targets) {
      const folderName = folderNameFromTargetConfig(target)
      if (separateFromTargetConfig(target)) {
        // Use index (folder segment name) for matching
        const targetIndex = base ? folderName.split('/').pop()! : folderName
        const folderIdx = rootSidebar.findIndex(item => item.index === targetIndex && item.items) // Match by index

        if (folderIdx !== -1) {
          const folderItem = rootSidebar[folderIdx]
          // Use index for the key as well
          sidebarMultiple[`${basePrefix}/${folderItem.index}/`] = folderItem.items || []
          rootSidebar.splice(folderIdx, 1) // Remove from the root list
        }
        else {
          sidebarMultiple[`${basePrefix}/${targetIndex}/`] = [] // Register key even if empty/not found
        }
      }
    }
    // Update the root sidebar in the result object
    sidebarMultiple[`${basePrefix}/`] = rootSidebar
  }

  if (skipLevelsConfig) {
    for (const key in sidebarMultiple) {
      if (Object.prototype.hasOwnProperty.call(sidebarMultiple, key)
        && Object.prototype.hasOwnProperty.call(skipLevelsConfig, key)) {
        const levelsToSkip = skipLevelsConfig[key]
        if (levelsToSkip > 0) {
          sidebarMultiple[key] = skipSidebarLevels(sidebarMultiple[key], levelsToSkip)
        }
      }
    }
  }

  // If only the root sidebar exists after all processing, return just the array
  // Check based on the initial basePrefix key
  if (Object.keys(sidebarMultiple).length === 1 && sidebarMultiple[`${basePrefix}/`]) {
    // If single optimization happened AND skipping was applied, this returns the skipped result.
    // If no optimization OR no skipping, it returns the correct array.
    return sidebarMultiple[`${basePrefix}/`]
  }

  return sidebarMultiple // Return the potentially modified record
}

export function calculateSidebar(
  targets: Array<string | { folderName: string, separate: boolean }> = ['笔记'],
  base?: string,
  skipLevelsConfig?: Record<string, number>,
): DefaultTheme.SidebarItem[] | DefaultTheme.SidebarMulti {
  const docs = listPages({ targets })
  return mergeSidebar(targets, docs, base, skipLevelsConfig)
}
