import { cwd } from 'node:process'
import { globSync } from 'tinyglobby'

interface ArticleTree {
  index: string
  text: string
  link?: string
  lastUpdated?: number
  collapsible?: boolean
  collapsed?: boolean
  items?: ArticleTree[]
  category?: string
}

export function listPages(options: { targets?: Array<string | { folderName: string, separate: boolean }>, ignore?: string[] }) {
  const { targets = [], ignore = [] } = options

  const files = globSync(`**/*.md`, {
    cwd: cwd(),
    ignore: [
      '_*',
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

function addRouteItem(indexes: ArticleTree[], path: string, base?: string) {
  const suffixIndex = path.lastIndexOf('.')
  const nameStartsAt = path.lastIndexOf('/') + 1
  const title = path.slice(nameStartsAt, suffixIndex)
  const item = {
    index: title,
    text: title,
    link: `/${path.slice(0, suffixIndex)}`,
  }

  let linkItems = item.link.split('/')
  linkItems = linkItems.slice(1)

  if (linkItems.length === 1)
    return

  if (base) {
    const baseItems = base.split('/').filter(Boolean)
    linkItems = linkItems.slice(baseItems.length)
  }

  indexes = addRouteItemRecursion(indexes, item, linkItems)
}

function addRouteItemRecursion(indexes: ArticleTree[], item: any, path: string[], upgradeIndex = false) {
  if (path.length === 1) {
    indexes.push(item)
    return indexes
  }
  else {
    const onePath = path.shift()
    if (!onePath)
      return indexes

    let obj = indexes.find(obj => obj.index === onePath)

    if (!obj) {
      // If not found, create a new one
      obj = { index: onePath, text: onePath, collapsed: true, items: [] }
      indexes.push(obj)
    }
    else if (!obj.items) {
      // If found, but no items, create a new one with collapsed
      obj.collapsed = true
      obj.items = []
    }

    if (path.length === 1 && path[0] === 'index') {
      // If there is only one element, and it is index.md, write link directly.
      obj.link = item.link
    }
    else {
      // Otherwise, continue to add recursively
      obj.items = addRouteItemRecursion(obj.items ?? [], item, path, upgradeIndex)
    }

    return indexes
  }
}

export function processSidebar(docs: string[], base?: string) {
  const sidebar: ArticleTree[] = []

  docs.map(async (docPath: string) => {
    addRouteItem(sidebar, docPath, base)
  })

  return sidebar
}

function articleTreeSort(articleTree: ArticleTree[]) {
  articleTree.sort((itemA, itemB) => {
    return itemA.text.localeCompare(itemB.text)
  })
  return articleTree
}

function sidebarSort(sidebar: ArticleTree[], folderTop: boolean = true) {
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

export function mergeSidebar(targets: Array<string | { folderName: string, separate: boolean }>, docs: string[], base?: string) {
  let sidebar = processSidebar(docs, base)
  sidebar = sidebarSort(sidebar, true)

  // If there is only one folder, use it as the root
  if (sidebar.length === 1 && targets.some((item) => {
    const folderName = folderNameFromTargetConfig(item)
    return base ? folderName.endsWith(sidebar[0].text) : folderName === sidebar[0].text
  })) {
    return sidebar[0].items ?? []
  }

  const basePrefix = base ? `/${base}` : ''
  // Pick out the `separate` folders, and construct a multiple sidebar structure
  const sidebarMultiple: Record<string, ArticleTree[]> = { [`${basePrefix}/`]: sidebar }

  for (const target of targets) {
    const folderName = folderNameFromTargetConfig(target)
    if (separateFromTargetConfig(target)) {
      const targetName = base ? folderName.split('/').pop() : folderName
      const matchedSidebarFolders = sidebar.filter(item => item.text === targetName)
      if (matchedSidebarFolders.length > 0) {
        sidebarMultiple[`${basePrefix}/${targetName}/`] = matchedSidebarFolders[0]?.items || []
        sidebar.splice(sidebar.findIndex(item => item.text === targetName), 1)
      }
      else {
        sidebarMultiple[`${basePrefix}/${targetName}/`] = []
      }
    }
  }

  return sidebarMultiple
}

export function calculateSidebar(targets: Array<string | { folderName: string, separate: boolean }> = ['笔记'], base?: string) {
  const docs = listPages({ targets })
  return mergeSidebar(targets, docs, base)
}
