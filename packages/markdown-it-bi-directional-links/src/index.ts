import { basename, extname, posix, relative, sep } from 'node:path'
import { cwd } from 'node:process'
import { globSync } from 'glob'
import type MarkdownIt from 'markdown-it'
import { cyan, gray, yellow } from 'colorette'
import _debug from 'debug'

import packageJSON from '../package.json'
import { findBiDirectionalLinks, genImage, genLink } from './utils'

/** it will match [[file]] and [[file|text]] */
const biDirectionalLinkPattern = /!?\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/
/** it will match [[file]] and [[file|text]] but only at the start of the text */
// eslint-disable-next-line regexp/no-unused-capturing-group
const biDirectionalLinkPatternWithStart = /^!?\[\[[^|\]\n]+(\|[^\]\n]+)?\]\](?!\()/

const IMAGES_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.bmp',
  '.tiff',
  '.apng',
  '.avif',
  '.jfif',
  '.pjpeg',
  '.pjp',
  '.png',
  '.svg',
  '.webp',
  '.xbm',
]

const debug = _debug(packageJSON.name)
const logModulePrefix = `${cyan(packageJSON.name)}${gray(':')}`

function warn(debugOn: boolean, format: string, ...params: any) {
  if (debugOn)
    console.warn(`${logModulePrefix} ${yellow('[WARN]')} ${format}`, ...params)
  else
    debug(`${logModulePrefix} ${yellow('[WARN]')} ${format}`, ...params)
}

function logFailedToMatchMarkupWarning(
  input: string,
  debugOn: boolean,
) {
  warn(debugOn, `Failed to match markup '${input}'.`)
}

function logIncorrectMatchedMarkupWarning(
  input: string,
  src: string,
  path: string,
  debugOn: boolean,
) {
  warn(debugOn, `Matched markup '${input}' is not at the start of the text. ${yellow(`

Things to check:

  1. Is this a expected markup for bi-directional links?
  2. Is there any other markup before this markup?`)}

${yellow('Source text:')}

  ${gray(src)}

  ${gray(`at`)} ${cyan(path)}
`)
}

function logNoMatchedFileWarning(
  rootDir: string,
  inputContent: string,
  markupTextContent: string,
  href: string,
  osSpecificHref: string,
  path: string,
  debugOn: boolean,
  relevantPath?: { key: string, source: string },
) {
  warn(debugOn, `No matched file found for '${osSpecificHref}' based on ${rootDir}, ignored. ${yellow(`

Things to check:

  1. Was the matched most relevant file expected?
    1. Was it renamed during the build process?
    2. Does it exist in the file system with the correct path?
    3. Does it have the correct extension? (Either .md for Markdown files or image extensions)
    4. Does it have the correct case? (Linux is Case-sensitive while macOS isn't)
    5. Does it have any special characters in the file name? (e.g. back slashes, quotes, illegal characters, etc.
  2. If <N/A> was shown, it means no relevant path was found. In such cases:
    1. Check the file system for the file if you expect it to get matched.
    2. Check whether mis-spelling or incorrect path was used in the markup.
  3. If you are using a custom base directory, check whether the base directory is correct.`)}

Matching chain:

  ${gray(inputContent)}
    -> ${gray(markupTextContent)}
      -> ${gray(href)}

${relevantPath ? `The most relevant paths: "${gray(relevantPath.key ?? '<N/A>')} matched by ${relevantPath.source ?? '<N/A>'}"` : ''}

  ${gray('at')} "${cyan(path)}"
`)
}

function findTheMostRelevantOne(
  possibleBiDirectionalLinksInCleanBaseNameOfFilePaths: Record<string, string>,
  possibleBiDirectionalLinksInFullFilePaths: Record<string, string>,
  href: string,
) {
  for (const key in possibleBiDirectionalLinksInCleanBaseNameOfFilePaths) {
    if (key.includes(href)) {
      return {
        key: possibleBiDirectionalLinksInCleanBaseNameOfFilePaths[key],
        source: 'file name',
      }
    }
  }
  for (const key in possibleBiDirectionalLinksInFullFilePaths) {
    if (key.includes(href)) {
      return {
        key: possibleBiDirectionalLinksInFullFilePaths[key],
        source: 'absolute path',
      }
    }
  }
}

export interface BiDirectionalLinksOptions {
  /**
   * The directory to search for bi-directional links.
   *
   * @default cwd() - Current working directory
   */
  dir?: string
  /**
   * The base directory joined as href for bi-directional links.
   *
   * @default '/'
   */
  baseDir?: string
  /**
   * The glob patterns to search for bi-directional linked files.
   *
   * @default '*.md, *.png, *.jpg, *.jpeg, *.gif, *.svg, *.webp, *.ico, *.bmp, *.tiff, *.apng, *.avif, *.jfif, *.pjpeg, *.pjp, *.png, *.svg, *.webp, *.xbm'
   */
  includesPatterns?: string[]
  /**
   * Whether to include debugging logs.
   *
   * @default false
   */
  debug?: boolean
  /**
   * Whether to exclude the warning when no matched file is found.
   *
   * @default false
   */
  noNoMatchedFileWarning?: boolean
}

/**
 * A markdown-it plugin to support bi-directional links.
 * @param options - Options.
 * @param options.dir - The directory to search for bi-directional links.
 * @param options.baseDir - The base directory joined as href for bi-directional links.
 * @param options.includesPatterns - The glob patterns to search for bi-directional links.
 * @returns A markdown-it plugin.
 */
export const BiDirectionalLinks: (options?: BiDirectionalLinksOptions) => (md: MarkdownIt) => void = (options) => {
  const rootDir = options?.dir ?? cwd()
  const baseDir = options?.baseDir ?? '/'
  const includes = options?.includesPatterns ?? []
  const debugOn = options?.debug ?? false
  const noNoMatchedFileWarning = options?.noNoMatchedFileWarning ?? false

  const possibleBiDirectionalLinksInCleanBaseNameOfFilePaths: Record<string, string> = {}
  const possibleBiDirectionalLinksInFullFilePaths: Record<string, string> = {}

  if (includes.length === 0) {
    includes.push('**/*.md')
    IMAGES_EXTENSIONS.forEach(ext => includes.push(`**/*${ext}`))
  }

  for (const include of includes) {
    const files = globSync(include, {
      nodir: true,
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
      if (!link) {
        logFailedToMatchMarkupWarning(src, debugOn)
        return false
      }

      if (!link.input) {
        logFailedToMatchMarkupWarning(src, debugOn)
        return false
      }

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
        logIncorrectMatchedMarkupWarning(link.input, src, state.env.path, debugOn)
        return false
      }

      const inputContent = link.input
      const markupTextContent = link[0]
      const href = link[1].trim() // href is the file name, uses posix style
      const text = link[3]?.trim() ?? ''

      const isImageRef = IMAGES_EXTENSIONS.some(ext => href.endsWith(ext))

      // Extract the pathname from the href
      const parsedHref = new URL(href, 'https://a.com')
      // 1. Remove the leading slash since pathname always starts with a slash and we don't want it
      // 2. Decode the pathname since it is url-encoded
      const parsedPathname = decodeURIComponent(parsedHref.pathname.slice(1))

      // Convert href to os specific path for matching and resolving
      let osSpecificHref = parsedPathname.split('/').join(sep)

      // if osSpecificHref has no extension, suffix it with .md
      if (!isImageRef && (extname(osSpecificHref) === '' || extname(osSpecificHref) !== '.md'))
        osSpecificHref += '.md'

      const matchedHref = findBiDirectionalLinks(possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, osSpecificHref)
      if (!matchedHref) {
        const relevantPath = findTheMostRelevantOne(possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, osSpecificHref)
        logNoMatchedFileWarning(rootDir, inputContent, markupTextContent, href, osSpecificHref, state.env.path, !noNoMatchedFileWarning, relevantPath)

        return false
      }

      let resolvedNewHref = posix.join(
        baseDir,
        relative(rootDir, matchedHref)
          .split(sep)
          .join('/'),
      )

      if (isImageRef) {
        genImage(state, resolvedNewHref, text, link)
      }
      else {
        resolvedNewHref = resolvedNewHref + parsedHref.search + parsedHref.hash
        genLink(state, resolvedNewHref, text, md, href, link)
      }

      return true
    })
  }
}
