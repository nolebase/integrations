import { basename, extname, join, relative } from 'node:path'
import fg from 'fast-glob'
import type { PluginSimple } from 'markdown-it'
import type Token from 'markdown-it/lib/token'

const biDirectionalLinkPattern = /\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/
const biDirectionalLinkPatternWithStart = /^\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/

function findBiDirectionalLinks(
  alreadyMatchedBiDirectionalLinks: Record<string, string>,
  possibleBiDirectionalLinksInFilePaths: Record<string, string>,
  possibleBiDirectionalLinksInFullFilePaths: Record<string, string>,
  link: RegExpMatchArray,
) {
  if (link.length < 2 || (!link[0] || !link[1]))
    return null

  if (alreadyMatchedBiDirectionalLinks[link[1]])
    return alreadyMatchedBiDirectionalLinks[link[1]]

  if (link[1].includes('/'))
    return possibleBiDirectionalLinksInFullFilePaths[link[1]]

  return possibleBiDirectionalLinksInFilePaths[link[1]]
}

/**
 * A markdown-it plugin to support bi-directional links.
 * @param options - Options.
 * @param options.dir - The directory to search for bi-directional links.
 * @param options.baseDir - The base directory joined as href for bi-directional links.
 * @param options.includesPatterns - The glob patterns to search for bi-directional links.
 * @returns
 */
export const BiDirectionalLinks: (options: {
  dir: string
  baseDir?: string
  includesPatterns?: string[]
}) => PluginSimple = (options) => {
  const rootDir = options.dir
  const includes = options?.includesPatterns ?? []

  const possibleBiDirectionalLinksInCleanBaseNameOfFilePaths: Record<string, string> = {}
  const possibleBiDirectionalLinksInFullFilePaths: Record<string, string> = {}
  const alreadyMatchedBiDirectionalLinks: Record<string, string> = {}

  if (includes.length === 0)
    includes.push('**/*.md')

  for (const include of includes) {
    const files = fg.sync(include, {
      onlyFiles: true,
      absolute: true,
      cwd: rootDir,
      ignore: [
        '_*',
        'dist',
        'node_modules',
      ],
    })

    for (const file of files) {
      const relativeFilePath = relative(rootDir, file)
      const ext = extname(relativeFilePath)
      const partialFilePathWithOnlyBaseName = basename(relativeFilePath).replace(ext, '')
      const fullFilePathWithoutExt = relativeFilePath.replace(ext, '')

      const existingFileName = possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName]

      // when conflict
      if (typeof existingFileName === 'string' && existingFileName !== '') {
        // remove key from clean base name map
        delete possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName]
        // remove key from full file path map
        delete possibleBiDirectionalLinksInFullFilePaths[existingFileName]

        // add key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[fullFilePathWithoutExt] = relativeFilePath
        // recover deleted and conflicted key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[existingFileName] = existingFileName

        continue
      }

      // otherwise, add key to both maps
      possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName] = relativeFilePath
      possibleBiDirectionalLinksInFullFilePaths[fullFilePathWithoutExt] = relativeFilePath
    }
  }

  return (md) => {
    md.inline.ruler.after('text', 'bi_directional_link_replace', (state) => {
      const src = state.src.slice(state.pos, state.posMax)
      const link = src.match(biDirectionalLinkPattern)
      if (!link)
        return false

      if (!link.input)
        return false

      if (!biDirectionalLinkPatternWithStart.exec(link.input))
        return false

      const inputContent = link.input
      const markupTextContent = link[0]
      const href = link[1]
      const text = link[3]

      const matchedHref = findBiDirectionalLinks(alreadyMatchedBiDirectionalLinks, possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, link)
      if (!matchedHref) {
        console.error('[BiDirectionalLinks]: A bi-directional link was matched by RegExp but it fails to pair a possible link within the current directory with following values:', `\n  current directory: ${rootDir}\n  input: ${inputContent}\n  markup: ${markupTextContent}\n  href: ${href}\n  text: ${text}`)
        return false
      }

      const resolvedNewHref = join(options.baseDir ?? '/', relative(rootDir, matchedHref))

      // Create new link_open
      const openToken = state.push('link_open', 'a', 1)
      openToken.attrSet('href', resolvedNewHref)

      // Final inline tokens for link content
      const linkTokenChildrenContent: Token[] = []

      // Produces a set of inline tokens and each contains a set of children tokens
      const parsedInlineTokens = text ? md.parseInline(text, null) : md.parseInline(href, null) || []

      // We are going to push the children tokens of each inline token to the final inline tokens
      // Need to check if the parsed inline tokens have children tokens
      if (parsedInlineTokens && parsedInlineTokens.length) {
        parsedInlineTokens.forEach((tokens) => {
          if (!tokens.children)
            return

          // If the inline token has children tokens, push them to the final inline tokens one by one
          tokens.children.forEach((token) => {
            linkTokenChildrenContent.push(token)
          })
        })
      }

      // Push the final inline tokens to the state
      for (const token of linkTokenChildrenContent) {
        const pushedToken = state.push(token.type, token.tag, token.nesting)
        pushedToken.content = token.content
      }

      // and link_close tokens
      state.push('link_close', 'a', -1)

      // Update the position in the source string
      state.pos += link[0].length

      return true
    })
  }
}
