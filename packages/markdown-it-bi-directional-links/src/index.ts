import type { PluginSimple } from 'markdown-it'

import { basename, dirname, extname, posix, relative, sep } from 'node:path'
import { cwd } from 'node:process'

import _debug from 'debug'

import { cyan, gray, yellow } from 'colorette'
import { globSync } from 'tinyglobby'

import packageJSON from '../package.json'

import { findBiDirectionalLinks, genAudio, genImage, genLink, genVideo } from './utils'

/** it will match [[file]] and [[file|text]] */
const biDirectionalLinkPattern = /!?\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\](?!\()/
/** it will match [[file]] and [[file|text]], but only at the start of the text */
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
  '.svg',
  '.webp',
  '.xbm',
]

// Web audio codec guide - Web media technologies | MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
// HTML audio - Wikipedia: https://en.wikipedia.org/wiki/HTML_audio#Supported_audio_coding_formats
const AUDIO_EXTENSIONS = [
  '.mp3',
  '.flac',
  '.wav',
  '.ogg',
  '.opus',
  '.webm',
  '.acc',
]

// Web video codec guide - Web media technologies | MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
// HTML video - Wikipedia: https://en.wikipedia.org/wiki/HTML_video#Browser_support
//
// Test videos:
// - Download Sample Videos / Dummy Videos For Demo Use https://sample-videos.com/
// - Download MP4 files for Testing - Online Test Case https://onlinetestcase.com/mp4-file/
const VIDEOS_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.mov',
  '.mkv',
  '.ogg',
  '.3gp',
  '.flv',
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
    4. Does it have any special characters in the file name? (e.g. back slashes, quotes, illegal characters, etc.)
  2. If <N/A> was shown, it means no relevant path was found. In such cases:
    1. Check the file system for the file if you expect it to get matched.
    2. Check whether mis-spelling or incorrect path was used in the markup.
  3. If you are using a custom base directory, check whether the base directory is correct.`)}

Matching chain:

  ${gray(inputContent)}
    -> ${gray(markupTextContent)}
      -> ${gray(href)}

${relevantPath ? `The most relevant path: "${gray(relevantPath.key ?? '<N/A>')}" matched by ${relevantPath.source ?? '<N/A>'}` : ''}

  ${gray('at')} "${cyan(path)}"
`)
}

function logMultipleCaseInsensitiveMatchedFilesWarning(
  rootDir: string,
  debugOn: boolean,
  osSpecificHref: string,
  hrefs: string[],
) {
  warn(debugOn, `Multiple case-insensitive matched files found for '${osSpecificHref}' based on ${rootDir}, using the first one.

All matched files:

 - ${gray(hrefs.join('\n - '))}
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
   * @default '*.md, *.png, *.jpg, *.jpeg, *.gif, *.svg, *.webp, *.ico, *.bmp, *.tiff, *.apng, *.avif, *.jfif, *.pjpeg, *.pjp, *.png, *.svg, *.webp, *.xbm, *.mp3, *.flac, *.wav, *.ogg, *.opus, *.mp4, *.webm, *.acc, *.mp4, *.webm, *.mov, *.mkv, *.ogg'
   */
  includesPatterns?: string[]
  /**
   * Excludes files added from `includePatterns` from being searched if it matches at least one of these patterns.
   *
   * @default '_*, dist, node_modules'
   */
  excludesPatterns?: string[]
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
  /**
   * Generate an error link or a link to a specific page when no matched file is found.
   *
   * When you use this option, you should define a css style for
   * `.nolebase-route-link-invalid` (or `a[href="#"] {}`) to
   * distinguish the invalid link from the normal link. Such as:
   * `a.nolebase-route-link-invalid { color: red; opacity: 0.6; }`
   *
   * @default false
   */
  stillRenderNoMatched?: boolean
  /**
   * Force a relative path instead of an absolute path
   *
   * @default false
   */
  isRelativePath?: boolean
}

/**
 * A markdown-it plugin to support bi-directional links.
 * @param options - Options.
 * @param options.dir - The directory to search for bi-directional links.
 * @param options.baseDir - The base directory joined as href for bi-directional links.
 * @param options.includesPatterns - The glob patterns to search for bi-directional links.
 * @param options.excludesPatterns - The glob patterns to exclude files from search.
 * @returns A markdown-it plugin.
 */
export const BiDirectionalLinks: (options?: BiDirectionalLinksOptions) => PluginSimple = (options) => {
  const rootDir = options?.dir ?? cwd()
  const baseDir = options?.baseDir ?? '/'
  const includes = options?.includesPatterns ?? []
  const excludes = options?.excludesPatterns ?? ['_*', 'dist', 'node_modules']
  const debugOn = options?.debug ?? false
  const noNoMatchedFileWarning = options?.noNoMatchedFileWarning ?? false
  const stillRenderNoMatched = options?.stillRenderNoMatched ?? false
  const isRelativePath = options?.isRelativePath ?? false

  const possibleBiDirectionalLinksInCleanBaseNameOfFilePaths: Record<string, string> = {}
  const possibleBiDirectionalLinksInFullFilePaths: Record<string, string> = {}

  if (includes.length === 0) {
    includes.push('**/*.md')
    IMAGES_EXTENSIONS.forEach(ext => includes.push(`**/*${ext}`))
    AUDIO_EXTENSIONS.forEach(ext => includes.push(`**/*${ext}`))
    VIDEOS_EXTENSIONS.forEach(ext => includes.push(`**/*${ext}`))
  }

  const files = globSync(includes, {
    onlyFiles: true,
    absolute: true,
    cwd: rootDir,
    ignore: excludes,
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
      const isVideoRef = VIDEOS_EXTENSIONS.some(ext => href.endsWith(ext))
      const isAudioRef = AUDIO_EXTENSIONS.some(ext => href.endsWith(ext))

      // Extract the pathname from the href
      const parsedHref = new URL(href.startsWith('?') ? relative(rootDir, state.env.path) + href : href, 'https://a.com')
      // 1. Remove the leading slash since pathname always starts with a slash and we don't want it
      // 2. Decode the pathname since it is url-encoded
      const parsedPathname = decodeURIComponent(parsedHref.pathname.slice(1))

      // If to self, direct return, no need to find and parse
      const isToSelf = href.startsWith('#') || href.startsWith('^')
      if (isToSelf) {
        let resolvedNewHref = ''
        parsedHref.hash = href
        resolvedNewHref = resolvedNewHref + parsedHref.search + parsedHref.hash
        genLink(state, resolvedNewHref, href.slice(1), md, href, link)
        return true
      }

      // Convert href to os specific path for matching and resolving
      let osSpecificHref = parsedPathname.split('/').join(sep)

      // if osSpecificHref has no extension, suffix it with .md
      if (!isImageRef && !isAudioRef && !isVideoRef && (extname(osSpecificHref) === '' || extname(osSpecificHref) !== '.md'))
        osSpecificHref += '.md'

      const matchedHrefSingleOrArray = findBiDirectionalLinks(possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, osSpecificHref)
      if (matchedHrefSingleOrArray === null || (Array.isArray(matchedHrefSingleOrArray) && matchedHrefSingleOrArray.length === 0)) {
        const relevantPath = findTheMostRelevantOne(possibleBiDirectionalLinksInCleanBaseNameOfFilePaths, possibleBiDirectionalLinksInFullFilePaths, osSpecificHref)
        logNoMatchedFileWarning(rootDir, inputContent, markupTextContent, href, osSpecificHref, state.env.path, !noNoMatchedFileWarning, relevantPath)
        if (stillRenderNoMatched) {
          genLink(state, '', href, md, href, link, true)
          return true
        }
        return false
      }

      let matchedHref: string | undefined
      if (Array.isArray(matchedHrefSingleOrArray)) {
        matchedHref = matchedHrefSingleOrArray[0]
        if (matchedHrefSingleOrArray.length > 1)
          logMultipleCaseInsensitiveMatchedFilesWarning(rootDir, debugOn, osSpecificHref, matchedHrefSingleOrArray)
      }
      else {
        matchedHref = matchedHrefSingleOrArray
      }

      let resolvedNewHref: string
      if (isRelativePath) {
        if (state.env.relativePath) { // VitePress
          resolvedNewHref = relative(dirname(state.env.relativePath), matchedHref)
            .split(sep)
            .join('/')
        }
        else if (state.env.filePathRelative) { // VuePress, see https://github.com/nolebase/integrations/pull/361 for details
          resolvedNewHref = relative(dirname(state.env.filePathRelative), matchedHref)
            .split(sep)
            .join('/')
        }
        else { // other
          console.error('Can\'t find local file path')
          return false
        }
      }
      else {
        resolvedNewHref = posix.join(
          baseDir,
          relative(rootDir, matchedHref)
            .split(sep)
            .join('/'),
        )
      }

      if (isImageRef) {
        genImage(state, resolvedNewHref, text, link)
      }
      else if (isAudioRef) {
        genAudio(state, resolvedNewHref, text, link)
      }
      else if (isVideoRef) {
        genVideo(state, resolvedNewHref, text, link)
      }
      else {
        resolvedNewHref = resolvedNewHref + parsedHref.search + parsedHref.hash
        genLink(state, resolvedNewHref, text, md, href, link)
      }

      return true
    })
  }
}
