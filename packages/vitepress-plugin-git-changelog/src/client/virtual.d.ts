interface Commit {
  path: string
  /**
   * The matched first tag of the commit.
   */
  tag?: string
  /**
   * The matched tags of the commit.
   */
  tags?: string[]
  /**
   * The URL of the release tag.
   */
  release_tag_url?: string
  /**
   * The URLs of the release tags.
   */
  release_tags_url?: string[]
  /**
   * The hash of the commit.
   */
  hash: string
  /**
   * The URL of the commit.
   */
  hash_url?: string
  /**
   * The date of the commit.
   */
  date: string
  /**
   * The UNIX timestamp of the commit.
   */
  date_timestamp: number
  /**
   * The message of the commit.
   */
  message: string
  /**
   * The refs of the commit.
   */
  refs?: string
  /**
   * The body of the commit.
   */
  body?: string
  /**
   * The author name of the commit.
   */
  author_name: string
  /**
   * The author email of the commit.
   */
  author_email: string
  /**
   * The author avatar of the commit.
   */
  author_avatar: string
  /**
   * The repository URL.
   */
  repo_url?: string
}

declare module 'virtual:nolebase-git-changelog' {
  interface Changelog {
    commits: Commit[]
  }

  const changelog: Changelog
  export default changelog
}
