import { describe, expect, it } from 'vitest'
import type { Commit, Contributor } from '../../types'
import {
  extractAuthorsWithMultiple,
  findMapAuthorByEmail,
  findMapAuthorByName,
  findMapAuthorLink,
  mapCommitAuthors,
  newAvatarForAuthor,
} from './author'

describe('findMapAuthorByEmail', () => {
  it('should return the registered creator by email', () => {
    const creators: Contributor[] = [
      {
        name: 'John Doe',
        mapByEmailAliases: ['example1@example.com'],
      },
    ]

    const creator = findMapAuthorByEmail(creators, 'example1@example.com')
    expect(creator).toEqual(creators[0])
  })
})

describe('findMapAuthorByName', () => {
  it('should return the registered creator by name', () => {
    const creators: Contributor[] = [
      {
        name: 'John Doe',
      },
    ]

    const creator = findMapAuthorByName(creators, 'John Doe')
    expect(creator).toEqual(creators[0])
  })

  it('should return the registered creator by nameAliases', () => {
    const creators: Contributor[] = [
      {
        name: 'John Doe',
        mapByNameAliases: ['Johndoe'],
      },
    ]

    const creator = findMapAuthorByName(creators, 'Johndoe')
    expect(creator).toEqual(creators[0])
  })
})

describe('findMapAuthorLink', () => {
  it('should return the registered creator plain link', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: 'github.com/johndoe',
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('github.com/johndoe')
  })

  it('should return the registered creator link', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: [
        {
          type: 'github',
          link: 'github.com/johndoe',
        },
      ],
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('github.com/johndoe')
  })

  it('should return the registered creator link follow by the priorities', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: [
        {
          type: 'twitter',
          link: 'twitter.com/johndoe',
        },
        {
          type: 'github',
          link: 'github.com/johndoe',
        },
      ],
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('github.com/johndoe')
  })

  it('should return the registered creator link follow by the priorities over twitter', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: [
        {
          type: 'twitter',
          link: 'twitter.com/johndoe',
        },
      ],
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('twitter.com/johndoe')
  })

  it('should return the registered creator link with only one link', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: [
        {
          type: 'personal',
          link: 'example.com',
        },
        {
          type: 'personal',
          link: 'example2.com',
        },
        {
          type: 'personal',
          link: 'example3.com',
        },
      ],
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('example.com')
  })

  it('should return the registered creator link with no links', () => {
    const creator: Contributor = {
      name: 'John Doe',
      username: 'johndoe',
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual('https://github.com/johndoe')
  })

  it('should return undefined when no links and username', () => {
    const creator: Contributor = {
      name: 'John Doe',
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual(undefined)
  })

  it('should return undefined when links is empty string', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: '',
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual(undefined)
  })

  it('should return undefined when links is empty array', () => {
    const creator: Contributor = {
      name: 'John Doe',
      links: [],
    }

    const link = findMapAuthorLink(creator)
    expect(link).toEqual(undefined)
  })
})

describe('newAvatarForAuthor', () => {
  it('should return the mapped author avatar', async () => {
    const mappedAuthor = {
      avatar: 'https://example.com/avatar.png',
    }

    const avatar = await newAvatarForAuthor(mappedAuthor, {
      author_name: 'John Doe',
      author_email: 'user@example.com',
      author_avatar: 'abcd',
    })

    expect(avatar).toEqual('https://example.com/avatar.png')
  })

  it('should return the mapped author avatar with username', async () => {
    const mappedAuthor = {
      username: 'johndoe',
    }

    const avatar = await newAvatarForAuthor(mappedAuthor, {
      author_name: 'John Doe',
      author_email: 'example.com',
      author_avatar: 'abcd',
    })

    expect(avatar).toEqual('https://github.com/johndoe.png')
  })

  it('should return the commit author avatar', async () => {
    const avatar = await newAvatarForAuthor(undefined, {
      author_name: 'John Doe',
      author_email: '',
      author_avatar: 'abcd',
    })

    expect(avatar).toEqual('https://gravatar.com/avatar/abcd?d=retro')
  })

  it('should return the commit author avatar with email', async () => {
    const avatar = await newAvatarForAuthor(undefined, {
      author_name: 'John Doe',
      author_email: 'user@example.com',
      author_avatar: '',
    })

    expect(avatar).toEqual('https://gravatar.com/avatar/b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514?d=retro')
  })
})

describe('mapCommitAuthors', () => {
  it('should be ok', async () => {
    const mappedCreators = {}
    await mapCommitAuthors([], mappedCreators, {
      author_name: 'John Doe',
      author_email: 'user@example.com',
      author_avatar: 'abcd',
    })
    expect(mappedCreators).toEqual({
      'John Doe': {
        name: 'John Doe',
        avatarUrl: 'https://gravatar.com/avatar/abcd?d=retro',
        commitsCount: 1,
        url: undefined,
      },
    })
  })

  it('should map mapped author by name alias', async () => {
    const mappedCreators = {}
    await mapCommitAuthors([{
      name: 'Altered name',
      avatar: 'https://example.com/avatar.png',
      mapByNameAliases: ['John Doe'],
    }], mappedCreators, {
      author_name: 'John Doe',
      author_email: 'user@example.com',
      author_avatar: 'abcd',
    })
    expect(mappedCreators).toEqual({
      'Altered name': {
        name: 'Altered name',
        avatarUrl: 'https://example.com/avatar.png',
        commitsCount: 1,
        url: undefined,
      },
    })
  })

  it('should map mapped author by email alias', async () => {
    const mappedCreators = {}
    const mapCreatorConfig = [{
      name: 'Altered name',
      avatar: 'https://example.com/avatar.png',
      mapByEmailAliases: ['user@example.com', 'user2@example.com'],
    }]
    await mapCommitAuthors(mapCreatorConfig, mappedCreators, {
      author_name: 'John Doe',
      author_email: 'user@example.com',
      author_avatar: 'abcd',
    })
    await mapCommitAuthors(mapCreatorConfig, mappedCreators, {
      author_name: 'John Doe',
      author_email: 'user2@example.com',
      author_avatar: 'abcd',
    })
    expect(mappedCreators).toEqual({
      'Altered name': {
        name: 'Altered name',
        avatarUrl: 'https://example.com/avatar.png',
        commitsCount: 2,
        url: undefined,
      },
    })
  })
})

describe('extractAuthorsWithMultiple', () => {
  it('should match multiple authors', async () => {
    const multipleAuthors = `
Co-authored-by: Standard <standard@example.com>
    Co-authored-by:         Spaced LastSpaced       <spaced@example.com>      `

    const authors = {}
    await extractAuthorsWithMultiple([], authors, { body: multipleAuthors } as Commit)
    expect(authors).toEqual({
      'Standard': {
        name: 'Standard',
        commitsCount: 1,
        avatarUrl: 'https://gravatar.com/avatar/1f39f2ec8cfad7452e421075f63b5c70fbee98736bd91b52d20161f8148ce38d?d=retro',
        url: undefined,
      },
      'Spaced LastSpaced': {
        name: 'Spaced LastSpaced',
        commitsCount: 1,
        avatarUrl: 'https://gravatar.com/avatar/d2bb5cf8baea77e9c60741c9815f13128ea1928b8a5342362af99d1f6fa69e07?d=retro',
        url: undefined,
      },
    })
  })
})
