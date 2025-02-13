// Great thanks to the following authors for the excellent reading time calculation code implementation
//
// Repository: vuepress-theme-hope
// By: Mister-Hope <https://github.com/Mister-Hope>
// Source code at: vuepress-theme-hope/packages/reading-time2/src/node/readingTime.ts <https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/packages/reading-time2/src/node/readingTime.ts>
//
// Repository: vuepress-theme-gungnir
// By: Renovamen <https://github.com/Renovamen>
// Source code at: vuepress-theme-gungnir/packages/plugins/reading-time/reading-time.js <https://github.com/Renovamen/vuepress-theme-gungnir/blob/v0/packages/plugins/reading-time/reading-time.js>
//
// Heavily inspired by the above two repositories, the following code is a combination of the two with some modifications and improvements.

// Types for different language handlers and reading time calculation
export interface LanguageHandler {
  regex: RegExp
  wordsPerMinute: number
}

export interface ReadingTimeStats {
  readingTime: number
  wordsCount: number
}

// Default language handlers for Chinese and Latin/Cyrillic based languages
const languageHandlers: Record<string, LanguageHandler> = {
  japanese: {
    regex: /\p{Script=Hiragana}|\p{Script=Katakana}/gu, // Match Japanese characters
    wordsPerMinute: 400, // Hypothetical average reading speed for Japanese
  },
  chinese: {
    regex: /\p{Script=Han}/gu, // Match Chinese characters
    wordsPerMinute: 300, // Average reading speed for Chinese
  },
  latinCyrillic: {
    regex: /[\p{Script=Latin}\p{Script=Cyrillic}\p{Mark}\p{Punctuation}\p{Number}]+/gu, // Match Latin and Cyrillic characters
    wordsPerMinute: 160, // Average reading speed for English and similar languages
  },
}

// Function to count words in a text based on the provided language handlers
function countWordsByLanguage(content: string): Record<string, number> {
  return Object.keys(languageHandlers).reduce((accumulator, language) => {
    const match = content.match(languageHandlers[language].regex)
    accumulator[language] = match ? match.length : 0

    return accumulator
  }, {} as Record<string, number>)
}

// Function to calculate reading time across multiple languages
export function calculateWordsCountAndReadingTime(content: string): ReadingTimeStats {
  const wordsCounts = countWordsByLanguage(content)

  const totalWords = Object.values(wordsCounts).reduce((sum, count) => sum + count, 0)
  const totalMinutes = Object.entries(wordsCounts).reduce((sum, [language, count]) => {
    return sum + (count / languageHandlers[language].wordsPerMinute)
  }, 0)

  return {
    readingTime: Math.ceil(totalMinutes),
    wordsCount: totalWords,
  }
}
