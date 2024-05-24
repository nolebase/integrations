// miketheprogrammer/xml-escape: Escape XML in javascript (NodeJS)
// https://github.com/miketheprogrammer/xml-escape

const escapeMap: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&apos;',
  '"': '&quot;',
  '&': '&amp;',
}

export function escape(content: string, ignore?: string): string {
  ignore = (ignore || '').replace(/[^&"<>']/g, '')
  const pattern = '([&"<>\'])'.replace(new RegExp(`[${ignore}]`, 'g'), '')

  return content.replace(new RegExp(pattern, 'g'), (_, item) => {
    return escapeMap[item]
  })
}
