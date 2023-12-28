interface Commit {
  path: string[][]
  tag?: string
  release_tag_url?: string
  hash: string
  hash_url?: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
  author_avatar: string
  repo_url?: string
}

interface Changelog {
  commits: Commit[]
}

declare module 'virtual:nolebase-git-changelog' {
  const changelog: Changelog
  export default changelog
}
