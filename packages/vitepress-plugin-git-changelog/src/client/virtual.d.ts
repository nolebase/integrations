interface Commit {
  path: string[][]
  tag?: string
  release_tag_url?: string
  hash: string
  hash_url?: string
  date: string
  date_timestamp: number
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
  author_avatar: string
  repo_url?: string
}

declare module 'virtual:nolebase-git-changelog' {
  interface Changelog {
    commits: Commit[]
  }

  const changelog: Changelog
  export default changelog
}
