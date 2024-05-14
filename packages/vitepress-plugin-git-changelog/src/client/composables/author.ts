import { digestStringAsSHA256 } from '../utils'
import type { Commit, Contributor } from '../../types'

export interface AuthorInfo {
  name: string
  commitsCount: number
  avatarUrl?: string
  url?: string
}

export function findMapAuthorByName(mapContributors: Contributor[] | undefined, author_name: string) {
  return mapContributors?.find((item) => {
    const res = (item.mapByNameAliases && Array.isArray(item.mapByNameAliases) && item.mapByNameAliases.includes(author_name)) || item.name === author_name
    if (res)
      return true

    // This is a fallback for the old version of the configuration.
    return item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(author_name)
  })
}

export function findMapAuthorByEmail(mapContributors: Contributor[] | undefined, author_email: string) {
  return mapContributors?.find((item) => {
    const res = item.mapByEmailAliases && Array.isArray(item.mapByEmailAliases) && item.mapByEmailAliases.includes(author_email)
    if (res)
      return true

    // This is a fallback for the old version of the configuration.
    return item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(author_email)
  })
}

export function findMapAuthorLink(creator: Contributor): string | undefined {
  if (typeof creator.links === 'string' && !!creator.links)
    return creator.links
  if (!Array.isArray(creator.links))
    return

  if (!creator.links && !!creator.username)
    return `https://github.com/${creator.username}`

  const priority = ['github', 'twitter']
  for (const p of priority) {
    const matchedEntry = creator.links?.find(l => l.type === p)
    if (matchedEntry)
      return matchedEntry.link
  }

  return creator.links?.[0]?.link
}

/**
 * This regular expression is used to match and parse commit messages that contain multiple author information.
 *
 * @see {@link https://regex101.com/r/q5YB8m/1 | Regexp demo}
 * @see {@link https://en.wikipedia.org/wiki/Email_address#Local-part | Email addres}
 * @see {@link https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors | Creating a commit with multiple authors in GitHub}
 */
const multipleAuthorsRegex = /^ *?Co-authored-by: ?(.*) ?(?:<)(.*)(?:>) *?/gmi

// This function handles multiple authors in a commit.
// It uses the regular expression to extract the name and email of each author from the commit message.
// About the docs: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
export async function extractAuthorsWithMultiple(
  mapContributors: Contributor[] | undefined,
  map: Record<string, AuthorInfo>,
  c: Commit,
) {
  if (!c.body)
    return
  let result: RegExpExecArray | null
  multipleAuthorsRegex.lastIndex = 0
  // eslint-disable-next-line no-cond-assign
  while (result = multipleAuthorsRegex.exec(c.body)) {
    const [, name, email] = result
    await mapCommitAuthors(mapContributors, map, {
      author_name: name,
      author_email: email,
      author_avatar: await digestStringAsSHA256(email),
    })
  }
}

export async function newAvatarForAuthor(mappedAuthor: Contributor | undefined, commitAuthor: Pick<Commit, 'author_name' | 'author_email' | 'author_avatar'>): Promise<string> {
  if (mappedAuthor) {
    if (mappedAuthor.avatar)
      return mappedAuthor.avatar
    if (mappedAuthor.username)
      return `https://github.com/${mappedAuthor.username}.png`
  }
  if (commitAuthor.author_avatar)
    return `https://gravatar.com/avatar/${commitAuthor.author_avatar}?d=retro`

  return `https://gravatar.com/avatar/${await digestStringAsSHA256(commitAuthor.author_email)}?d=retro`
}

export async function mapCommitAuthors(
  mapContributors: Contributor[] | undefined,
  map: Record<string, AuthorInfo>,
  commitAuthor: Pick<Commit, 'author_name' | 'author_email' | 'author_avatar'>,
) {
  const targetCreatorByName = findMapAuthorByName(mapContributors, commitAuthor.author_name)
  const targetCreatorByEmail = findMapAuthorByEmail(mapContributors, commitAuthor.author_email)

  let name = ''
  let avatar = ''
  let url: string | undefined

  if (targetCreatorByName) {
    name = targetCreatorByName.name || commitAuthor.author_name
    avatar = await newAvatarForAuthor(targetCreatorByName, commitAuthor)

    const foundSocialEntryUrl = findMapAuthorLink(targetCreatorByName)
    if (foundSocialEntryUrl)
      url = foundSocialEntryUrl
  }
  else if (targetCreatorByEmail) {
    name = targetCreatorByEmail.name || commitAuthor.author_name
    avatar = await newAvatarForAuthor(targetCreatorByEmail, commitAuthor)

    const foundSocialEntryUrl = findMapAuthorLink(targetCreatorByEmail)
    if (foundSocialEntryUrl)
      url = foundSocialEntryUrl
  }
  else {
    name = commitAuthor.author_name
    avatar = await newAvatarForAuthor(undefined, commitAuthor)
  }

  if (!map[name]) {
    map[name] = {
      name,
      commitsCount: 0,
      avatarUrl: avatar,
      url,
    }
  }

  map[name].commitsCount++
}
