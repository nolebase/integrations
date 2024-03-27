import { basename, extname, posix, relative, sep } from 'node:path'
import { env } from 'node:process'
import fg from 'fast-glob'
import type { PluginSimple } from 'markdown-it'
import { cyan, gray, yellow } from 'colorette'

import { findBiDirectionalLinks, genImage, genLink } from './utils'

/** it will match [[file]] and [[file|text]] */
const biDirectionalLinkPattern = /\!?\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/
/** it will match [[file]] and [[file|text]] but only at the start of the text */
const biDirectionalLinkPatternWithStart = /^\!?\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/

const IMAGES_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff', '.apng', '.avif', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.webp', '.xbm']

function logIncorrectMatchedMarkupWarning(
  input: string,
  src: string,
  path: string,
) {
  const debug = (import.meta?.env?.DEBUG ?? env?.DEBUG) || ''

  if (!debug)
    return
  if (debug !== '@nolebase/*')
    return
  if (debug !== '@nolebase/markdown-it-*')
    return
  if (!debug.includes('@nolebase/markdown-it-bi-directional-links'))
    return

  console.warn(`${yellow(`[@nolebase/markdown-it-bi-directional-links] [WARN] Matched markup '`) + input + yellow(`' is not at the start of the text.`)} ${yellow(`

Things to check:

  1. Is this a expected markup for bi-directional links?
  2. Is there any other markup before this markup?`)}

${yellow('Source text:')}

  ${gray(src)}

  ${gray(`at`)} ${cyan(path)}
`)
}

function logNoMatchedFileWarning(
  inputContent: string,
  markupTextContent: string,
  href: string,
  osSpecificHref: string,
  path: string,
) {
  console.warn(`${yellow('[@nolebase/markdown-it-bi-directional-links] [WARN]')} ${yellow(`No matched file found for '`) + osSpecificHref + yellow(`', ignored.`)}

Matching chain:
  ${gray(inputContent)}
    -> ${gray(markupTextContent)}
      -> ${gray(href)}

  ${gray('at')} ${cyan(path)}
`)
}

function trimInvalidCharsForFileName(str: string) {
  return str.replace(/`/g, '')
}

/**
 * A markdown-it plugin to support bi-directional links.
 * @param options - Options.
 * @param options.dir - The directory to search for bi-directional links.
 * @param options.baseDir - The base directory joined as href for bi-directional links.
 * @param options.includesPatterns - The glob patterns to search for bi-directional links.
 * @returns A markdown-it plugin.
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

  if (includes.length === 0) {
    includes.push('**/*.md')
    IMAGES_EXTENSIONS.forEach(ext => includes.push(`**/*${ext}`))
  }

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
      const partialFilePathWithOnlyBaseName = basename(relativeFilePath)

      const existingFileName = possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName]

      // when conflict
      if (typeof existingFileName === 'string' && existingFileName !== '') {
        // remove key from clean base name map
        delete possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName]
        // remove key from full file path map
        delete possibleBiDirectionalLinksInFullFilePaths[existingFileName]

        // add key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[relativeFilePath] = relativeFilePath
        // recover deleted and conflicted key to full file path map
        possibleBiDirectionalLinksInFullFilePaths[existingFileName] = existingFileName

        continue
      }

      // otherwise, add key to both maps
      possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[partialFilePathWithOnlyBaseName] = relativeFilePath
      possibleBiDirectionalLinksInFullFilePaths[relativeFilePath] = relativeFilePath
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

      // Sometimes the matched markup is not at the start of the text
      // in many scenarios, e.g.:
      // 1. `[[file]]` is matched but it is not at the start of the text, but [[file]] will be valid without quotes
      // 2. `[[file|text]]` is matched but it is not at the start of the text, but [[file|text]] will be valid without quotes
      //
      // For such cases, we will log a warning and ignore the matched markup
      // If user would like to see the warning, they can enable debug mode
      // by setting `DEBUG=@nolebase/markdown-it-bi-directional-links` in the environment variable
      // or by setting `import.meta.env.DEBUG = '@nolebase/markdown-it-bi-directional-links'` in the script.
      if (!biDirectionalLinkPatternWithStart.exec(link.input)) {
        logIncorrectMatchedMarkupWarning(link.input, src, state.env.path)
        return false
      }

      const isAttachmentRef = link.input.startsWith('!')

      const inputContent = link.input
      const markupTextContent = link[0]
      const href = link[1] // href is the file name, uses posix style
      const text = link[3] ?? ''

      const isImageRef = isAttachmentRef && IMAGES_EXTENSIONS.some(ext => href.endsWith(ext))

      // Convert href to os specific path for matching and resolving
      let osSpecificHref = href.split('/').join(sep)

      // if osSpecificHref has no extension, suffix it with .md
      if (!isImageRef && extname(osSpecificHref) === '')
        osSpecificHref += '.md'

      // before matching against actual file path, we will need to normalize
      // the osSpecificHref without any invalid characters for file systems,
      // e.g. ` (backtick) is not allowed.
      osSpecificHref = trimInvalidCharsForFileName(basename(osSpecificHref))

      const matchedHref = findBiDirectionalLinks(possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, osSpecificHref)
      if (!matchedHref) {
        logNoMatchedFileWarning(inputContent, markupTextContent, href, osSpecificHref, state.env.path)
        return false
      }

      const resolvedNewHref = posix.join(options.baseDir ?? '/', relative(rootDir, matchedHref).split(sep).join('/'))

      if (isImageRef)
        genImage(state, resolvedNewHref, link, text)
      else
        genLink(state, resolvedNewHref, link, text)

      return true
    })
  }
}
