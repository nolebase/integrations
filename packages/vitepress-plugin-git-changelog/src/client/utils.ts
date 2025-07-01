import type { Locale } from 'date-fns'

import { formatDistanceToNow, toDate } from 'date-fns'
import { subtle } from 'uncrypto'

import * as DateFnsLocales from 'date-fns/locale'

export function renderMarkdown(markdownText = '') {
  const htmlText = markdownText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*)\*/g, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt=\'$1\' src=\'$2\' />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a class="no-icon" href=\'$2\'>$1</a>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n$/gm, '<br />')

  return htmlText.trim()
}

export function renderCommitMessage(repoLink: string, msg: string) {
  return renderMarkdown(msg)
    .replace(/#(\d+)/g, `<a class="no-icon" href=\'${repoLink}/issues/$1\'>#$1</a>`)
}

export function formatDistanceToNowFromValue(value: Date, localeName = 'enUS') {
  try {
    return formatDistanceToNow(toDate(value), {
      locale: (DateFnsLocales as Record<string, Locale>)[localeName] || 'enUS',
      addSuffix: true,
    })
  }
  catch {
    return value.toLocaleDateString()
  }
}

export function isStringArray(value: any): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

/**
 * Hashes a string using SHA-256
 *
 * Official example by MDN: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * @param {string} message - The message to be hashed
 * @returns {Promise<string>} - The SHA-256 hash of the message
 */
export async function digestStringAsSHA256(message: string) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('') // convert bytes to hex string
  return hashHex
}
