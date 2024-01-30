/// <reference types="../types/index" />

declare module 'virtual:nolebase-page-properties' {
  const pagePropertiesData: Record<string, {
    wordCount: number
    readingTime: number
  }>

  export default pagePropertiesData
}
