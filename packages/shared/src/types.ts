export interface ArticleTree {
  index: string
  text: string
  link?: string
  lastUpdated?: number
  collapsible?: true
  collapsed?: true
  items?: ArticleTree[]
  category?: string
}

export interface Doc {
  relativePath: string,
  hashes: {
    sha256: {
      content: string
      contentDiff?: string
    },
  },
  ignoreWhenGenerateTagsFromGPT?: boolean,
}

export interface Tag {
  name: string
  alias: string[],
  description: string,
  appearedInDocs: string[],
  count: number,
}

export type TagAlias = {
  name: string
  aliases: string[]
}

export interface Metadata {
  docs: Doc[],
  tags: Tag[],
  sidebar: ArticleTree[]
}
