export interface Commit {
  /**
   * The file path for this commit.
   *
   * When the file is located in `srcDir`, the path is relative to `srcDir`.
   * Otherwise, the path is relative to cwd. Paths without `. /`.
   */
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
  /**
   * The digits of commit hash.
   */
  commitHashDigits?: number
}

export interface Changelog {
  commits: Commit[]
}

export interface SocialEntry {
  type: 'github' | 'twitter' | 'email' | string
  link: string
}

export interface Contributor {
  /**
   * The overriding display name of the contributor
   */
  name?: string
  /**
   * The overriding GitHub, GitLab, Gitea username of the contributor
   */
  username?: string
  /**
   * The overriding avatar of the contributor
   */
  avatar?: string
  /**
   * Whether to add a link to the contributor's profile
   */
  links?: string | SocialEntry[]
  /**
   * More names to be recognized as the same contributor.
   *
   * Useful when you changed your name or email address in the past.
   *
   * @deprecated Use `mapByNameAliases` instead
   * @see mapByNameAliases
   */
  nameAliases?: string[]
  /**
   * More names to be recognized as the same contributor.
   *
   * Useful when you changed your name or email address in the past.
   */
  mapByNameAliases?: string[]
  /**
   * More emails to be recognized as the same contributor.
   *
   * Useful when you changed your email address in the past.
   *
   * @deprecated Use `mapByEmailAliases` instead
   * @see mapByEmailAliases
   */
  emailAliases?: string[]
  /**
   * More emails to be recognized as the same contributor.
   *
   * Useful when you changed your email address in the past.
   */
  mapByEmailAliases?: string[]
}

export type {
  Contributor as Author,
}
