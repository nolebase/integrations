import { formatDistanceToNow, toDate } from 'date-fns'
import type { Locale } from 'date-fns'
import * as DateFnsLocales from 'date-fns/locale'

export function renderMarkdown(markdownText = '') {
  const htmlText = markdownText
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt=\'$1\' src=\'$2\' />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href=\'$2\'>$1</a>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/\n$/gim, '<br />')

  return htmlText.trim()
}

export function renderCommitMessage(repoLink: string, msg: string) {
  return renderMarkdown(msg)
    .replace(/\#([0-9]+)/g, `<a href=\'${repoLink}/issues/$1\'>#$1</a>`)
}

export function formatDistanceToNowFromValue(value: Date, localeName = 'enUS') {
  try {
    return formatDistanceToNow(toDate(value), {
      locale: (DateFnsLocales as Record<string, Locale>)[localeName] || 'enUS',
      addSuffix: true,
    })
  }
  catch (err) {
    return value
  }
}
