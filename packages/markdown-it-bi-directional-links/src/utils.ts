import { sep } from 'node:path'
import type Token from 'markdown-it/lib/token'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline'
import type MarkdownIt from 'markdown-it'

/**
 * Find / resolve bi-directional links.
 * @param possibleBiDirectionalLinksInFilePaths - file path is the key
 * @param possibleBiDirectionalLinksInFullFilePaths - full file path is the key
 * @param href - URL style file name representation
 */
export function findBiDirectionalLinks(
  possibleBiDirectionalLinksInFilePaths: Record<string, string>,
  possibleBiDirectionalLinksInFullFilePaths: Record<string, string>,
  href: string,
) {
  if (!href)
    return null

  if (href.includes(sep))
    return possibleBiDirectionalLinksInFullFilePaths[href]

  return possibleBiDirectionalLinksInFilePaths[href]
}

export function genLink(state: StateInline, resolvedNewHref: string, text: string, md: MarkdownIt, href: string, link: RegExpMatchArray) {
  // Create new link_open
  const openToken = state.push('link_open', 'a', 1)
  openToken.attrSet('href', resolvedNewHref)

  // Final inline tokens for link content
  const linkTokenChildrenContent: Token[] = []

  // Produces a set of inline tokens and each contains a set of children tokens
  const parsedInlineTokens = text ? md.parseInline(text, state.env) : md.parseInline(href, state.env) || []

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
  state.pos += link![0].length
}

export function genImage(state: StateInline, resolvedNewHref: string, text: string, link: RegExpMatchArray) {
  const openToken = state.push('image', 'img', 1)
  openToken.attrSet('src', resolvedNewHref)
  openToken.attrSet('alt', '')

  openToken.children = []
  openToken.content = text

  const innerTextToken = state.push('text', '', 0)
  innerTextToken.content = text
  openToken.children.push(innerTextToken)

  state.pos += link![0].length
}
