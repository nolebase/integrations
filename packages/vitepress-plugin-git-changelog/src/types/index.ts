export interface Commit {
  path: string[][]
  tag?: string
  release_tag_url?: string
  hash: string
  hash_url?: string
  date: string
  date_timestamp?: number
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
  author_avatar: string
  repo_url?: string
}

export interface Changelog {
  commits: Commit[]
}

export interface SocialEntry {
  type: 'github' | 'twitter' | 'email' | string
  icon: string
  link: string
}

export interface Contributor {
  name?: string
  avatar?: string
  email?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}
