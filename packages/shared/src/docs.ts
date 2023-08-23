import type { Doc } from '../src/types'
import matter from 'gray-matter'
import { createHash } from 'crypto'
import { readFile } from 'fs/promises'
import fg from 'fast-glob'

/**
 * 列出所有的页面
 * @param dir
 * @param options
 * @returns
 */
export async function listPages(dir: string, options: { target?: string, ignore?: string[] }) {
  const {
    target = '',
    ignore = []
  } = options

  const files = await fg(`${target}**/*.md`, {
    onlyFiles: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })

  files.sort()
  return files
}

export async function processSingleDocumentation(documentationFilePath: string, existingDocs: Doc[], tagsToBeProcessed: { doc: string, tags: string[] }[]) {
  // 尝试在 docsMetadata.docs 中找到当前文件的历史 hash 记录
  let found = existingDocs.find((item) => {
    if (item.relativePath === documentationFilePath) return item
  })

  // 读取源文件
  const content = await readFile(documentationFilePath, 'utf-8')
  // 解析 Markdown 文件的 frontmatter
  const parsedPageContent = matter(content)

  if (Array.isArray(parsedPageContent.data.tags)) {
    tagsToBeProcessed.push({ doc: documentationFilePath, tags: parsedPageContent.data.tags })
  }

  const hash = createHash('sha256')
  const tempSha256Hash = hash.update(parsedPageContent.content).digest('hex') // 对 Markdown 正文进行 sha256 hash

  // 如果没有找到，就初始化
  if (!found) {
    return {
      relativePath: documentationFilePath,
      hashes: { sha256: { content: tempSha256Hash } },
    }
  } else {
    // 如果 found.hashes 不存在，就初始化
    if (!found.hashes) found.hashes = { sha256: { content: tempSha256Hash } }
    // 如果 found.hashes.sha256 不存在，就初始化
    if (!found.hashes.sha256) found.hashes.sha256 = { content: tempSha256Hash }
    // 如果历史记录的 sha256 hash 与当前的相同，就不标记 contentDiff，并且直接返回
    if (found.hashes.sha256.content === tempSha256Hash && !found.hashes.sha256.contentDiff) return found

    // 否则，标记 contentDiff
    found.hashes.sha256.contentDiff = tempSha256Hash
    return found
  }
}

/**
 * 处理 docsMetadata.docs，计算和统计 sha256 hash 等信息
 * @param documentationFileList 符合 glob 的文件列表
 * @param metadataObj docsMetadata.json 的内容
 */
export async function processDocumentations(documentationFileList: string[], existingDocs: Doc[]) {
  if (!existingDocs) existingDocs = []

  const tagsInDocumentations: { doc: string, tags: string[] }[] = []

  const processedDocs = await Promise.all(documentationFileList.map((documentationFilePath) => {
    return processSingleDocumentation(documentationFilePath, existingDocs, tagsInDocumentations)
  }))

  return {
    docs: processedDocs,
    tags: tagsInDocumentations
  }
}
