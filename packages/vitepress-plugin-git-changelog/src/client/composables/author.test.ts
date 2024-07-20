import { describe, expect, it } from 'vitest'
import type { Commit, Contributor } from '../../types'
import {
  extractAuthorsWithMultiple,
  mapCommitAuthors,
} from './author'

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
