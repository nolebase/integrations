export interface RawCommit {
  /**
   * The file path for this commit.
   *
   * When the file is located in `srcDir`, the path is relative to `srcDir`.
   * Otherwise, the path is relative to cwd. Paths without `. /`.
   */
  path: string
  /**
   * The hash of the commit.
   */
  hash: string
  /**
   * The date of the commit.
   */
  date: string
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
}

export interface MergedRawCommit extends Omit<RawCommit, 'path'> {
  paths: string[]
}

export interface Commit extends Omit<MergedRawCommit, 'date' | 'body' | 'refs' | 'author_name' | 'author_email'> {
  /**
   * The file path for this commit.
   *
   * When the file is located in `srcDir`, the path is relative to `srcDir`.
   * Otherwise, the path is relative to cwd. Paths without `. /`.
   */
  paths: string[]
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
   * The UNIX timestamp of the commit.
   */
  date_timestamp: number
  /**
   * The message of the commit.
   */
  message: string

  authors: string[]

  /**
   * The repository URL.
   */
  repo_url?: string
}

export interface CommitAuthor {
  /**
   * The author name of the commit.
   */
  name: string
  /**
   * The author alternative names for i18n
   */
  i18n?: Record<string, string>
  /**
   * The author email of the commit.
   */
  email?: string
  /**
   * The author avatar of the commit.
   */
  avatarUrl?: string
  url?: string
}

export interface Changelog {
  commits: Commit[]
  authors: CommitAuthor[]
}

export interface SocialEntry {
  type: 'github' | 'twitter' | 'email' | string
  link: string
}

export interface Contributor {
  /**
   * The overriding display name of the contributor in default locale
   */
  name?: string
  /**
   * The overriding display name of the contributor in other locales if needed
   */
  i18n?: Record<string, string>
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
