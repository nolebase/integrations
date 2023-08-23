import { resolve } from 'path'
import Git, { SimpleGit } from 'simple-git'
import type { TagAlias, Metadata, Tag } from '@nolebase/shared/types'
import uniq from 'lodash/uniq'
import type { Plugin } from 'vite'
import { listPages, processDocumentations } from '@nolebase/shared/docs'

/**
 * 添加和计算路由项
 * @param indexes
 * @param path
 * @param upgradeIndex
 * @returns
 */
async function addRouteItem(git: SimpleGit, targetDir: string, indexes: any[], path: string, upgradeIndex = false) {
  const suffixIndex = path.lastIndexOf('.')
  const nameStartsAt = path.lastIndexOf('/') + 1
  const title = path.slice(nameStartsAt, suffixIndex)
  const item = {
    index: title,
    text: title,
    link: `/${path.slice(0, suffixIndex)}`,
    lastUpdated: +await git.raw(['log', '-1', '--format=%at', path]) * 1000
  }
  const linkItems = item.link.split('/')
  linkItems.shift()

  targetDir.split('/').forEach((item) => {
    if (item)
      linkItems.shift()
  })

  if (linkItems.length === 1) {
    return
  }

  indexes = addRouteItemRecursion(indexes, item, linkItems, upgradeIndex)
}

/**
 * 递归式添加和计算路由项
 * @param indexes
 * @param item
 * @param path
 * @param upgradeIndex
 * @returns
 */
function addRouteItemRecursion(indexes: any[], item: any, path: string[], upgradeIndex: boolean) {
  if (path.length === 1) {
    indexes.push(item)
    return indexes
  }
  else {
    const onePath = path.shift()
    let obj = indexes.find(obj => obj.index === onePath)

    if (!obj) {
      // 如果没有找到，就创建一个
      obj = { index: onePath, text: onePath, collapsed: true, items: [] }
      indexes.push(obj)
    } else if (!obj.items) {
      // 如果找到了，但是没有 items，就创建对应的 items 和标记为可折叠
      obj.collapsed = true
      obj.items = []
    }

    if (path.length === 1 && path[0] === 'index') {
      // 如果只有一个元素，并且是 index.md，直接写入 link 和 lastUpdated
      obj.link = item.link
      obj.lastUpdated = item.lastUpdated
    } else {
      // 否则，递归遍历
      obj.items = addRouteItemRecursion(obj.items, item, path, upgradeIndex)
    }

    return indexes
  }
}

/**
 * 处理 docsMetadata.sidebar，拼接 sidebar 路由树
 * @param docs 符合 glob 的文件列表
 * @param docsMetadata docsMetadata.json 的内容
 */
async function processSidebar(git: SimpleGit, targetDir: string, docs: string[], docsMetadata: Metadata) {
  await Promise.all(docs.map(async (docPath: string) => {
    await addRouteItem(git, targetDir, docsMetadata.sidebar, docPath)
  }))
}

/**
 * 判断 srcTag 是否是 targetTag 的别名
 *
 * 判断根据下面的规则进行：
 * 1. srcTag === targetTag
 * 2. srcTag.toUpperCase() === targetTag.toUpperCase()
 *
 * @param srcTag
 * @param targetTag
 * @returns
 */
function isTagAliasOfTag(srcTag: string, targetTag: string) {
  return srcTag === targetTag || srcTag.toUpperCase() === targetTag.toUpperCase()
}

function findTagAlias(tag: string, docsMetadata: Metadata, aliasMapping: TagAlias[]) {
  const potentialAlias: string[] = []

  docsMetadata.tags.forEach((item) => {
    // 在已经存在在 docsMetadata.json 中的 alias 进行查找和筛选
    item.alias.filter((alias) => {
      return isTagAliasOfTag(alias, tag) // 筛选 alias 是 tag 的别名的 alias
    }).forEach((alias) => {
      potentialAlias.push(alias) // 将别名加入到 potentialAlias 中
    })

    if (isTagAliasOfTag(item.name, tag)) { // 如果有记录的 tag.name 是当前 tag 的别名
      potentialAlias.push(item.name) // 那么将 tag.name 加入到 potentialAlias 中
    }
  })

  // 在 docsTagsAlias.json 中进行查找和筛选
  for (const aliasTag of aliasMapping) {
    // 如果人工编撰的的 aliasTag.name 是当前 tag 的别名
    // 那么这意味着 aliasTag.name 和 aliasTag.alias 中的所有 alias 都是当前 tag 的别名
    if (isTagAliasOfTag(aliasTag.name, tag)) {
      // 将 aliasTag.name 和 aliasTag.alias 中的所有 alias 加入到 potentialAlias 中
      potentialAlias.push(aliasTag.name)
      potentialAlias.push(...aliasTag.aliases)
    }

    aliasTag.aliases.forEach((alias) => {
      // 如果人工编撰的的 aliasTag.alias 中的某个 alias 是当前 tag 的别名
      // 那么这意味着 aliasTag.name 和 aliasTag.alias 中的所有 alias 都是当前 tag 的别名
      if (isTagAliasOfTag(alias, tag)) {
        // 将 aliasTag.name 和 aliasTag.alias 中的所有 alias 加入到 potentialAlias 中
        potentialAlias.push(aliasTag.name)
        potentialAlias.push(...aliasTag.aliases)
      }
    })
  }

  return potentialAlias
}

/**
 * 处理 docsMetadata.tags，计算和统计 tag 的信息
 * @param documentationFileList 符合 glob 的文件列表
 * @param metadata docsMetadata.json 的内容
 * @param tags 当前文档的 tags
 * @param tagAliases docsTagsAlias.json 的内容
 */
async function processTags(documentationFileList: string, metadata: Metadata, tags: string[], tagAliases: TagAlias[]) {
  for (const tag of tags) {
    metadata.tags = metadata.tags || []
    const found = metadata.tags.find((item) => {
      if (item.name === tag) return item
    })

    // 优先查找所有的 alias
    const aliases = uniq(findTagAlias(tag, metadata, tagAliases))

    // 对于每一个 alias，如果在 docsMetadata.tags 中找到了，那么就将当前 doc 加入到 appearedInDocs 中
    metadata.tags.forEach((item, index) => {
      aliases.forEach((alias) => {
        if (item.name === alias && !metadata.tags[index].appearedInDocs.includes(documentationFileList))
          metadata.tags[index].appearedInDocs.push(documentationFileList)
      })
    })

    // 如果 tag 尚未出现在 docsMetadata.tags 中，那么就创建一个新的 tag
    if (!found) {
      const tagRecord: Tag = {
        name: tag,
        alias: aliases,
        appearedInDocs: [],
        description: '',
        count: 1
      }

      // 将当前 doc 加入到 appearedInDocs 中
      tagRecord.appearedInDocs.push(documentationFileList)
      // 将新创建的 tag 加入到 docsMetadata.tags 中
      metadata.tags.push(tagRecord)
      continue
    }

    found.count++
    if (!found.appearedInDocs.includes(documentationFileList)) found.appearedInDocs.push(documentationFileList)
    found.alias = uniq([...found.alias, ...aliases])
  }
}

/**
 * 处理 docsMetadata.docs，计算和统计 sha256 hash 等信息
 * @param documentationFileList 符合 glob 的文件列表
 * @param metadataObj docsMetadata.json 的内容
 */
async function processDocs(documentationFileList: string[], metadataObj: Metadata, tagAliases: TagAlias[]) {
  if (!metadataObj.docs) metadataObj.docs = []

  const { docs, tags } = await processDocumentations(documentationFileList, metadataObj.docs)
  metadataObj.docs = docs

  await Promise.all(tags.map(async ({ doc, tags }) => {
    await processTags(doc, metadataObj, tags, tagAliases)
  }))
}

export function Metadata(options: {
  target: string
  dir?: string
  tagsAlias?: TagAlias[]
}): Plugin {
  const virtualModuleId = '/virtual:nolebase-vitepress-metadata'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  let git: SimpleGit
  let dir: string
  let targetDir = options.target

  return {
    name: '@nolebase/vite-plugin-vitepress-metadata',
    configResolved(c) {
      dir = c.root
      if (options.dir) {
        dir = resolve(c.root, options.dir)
      }

      targetDir = resolve(c.root, options.target)
      git = Git(c.root)
    },
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    async load(id) {
      if (id !== virtualModuleId) {
        return null
      }
      if (!git || !dir) {
        return null
      }

      const docs = await listPages(dir, { target: targetDir })
      const docsMetadata: Metadata = { docs: [], sidebar: [], tags: [] }
      await processDocs(docs, docsMetadata, options.tagsAlias || [])
      await processSidebar(git, targetDir, docs, docsMetadata)
      return `export default ${JSON.stringify(docsMetadata)}`
    }
  }
}
