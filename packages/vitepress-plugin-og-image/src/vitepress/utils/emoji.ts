import regexCreator from 'emoji-regex'

const emojiRegex = regexCreator()

export function removeEmoji(str: string) {
  return str.replace(emojiRegex, '')
}
