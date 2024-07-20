import { describe, expect, it } from 'vitest'

import type { Commit, Contributor } from '../types'
import {
  defaultCommitURLHandler,
  defaultReleaseTagURLHandler,
  defaultReleaseTagsURLHandler,
  findMapAuthorByEmail,
  findMapAuthorByName,
  findMapAuthorLink,
  mergeRawCommits,
  newAvatarForAuthor,
  parseCommitAuthors,
  parseCommits,
  parseGitLogRefsAsTags,
  parseRawCommitLogs,
  rewritePathsByPatterns,
  rewritePathsByRewritingExtension,
} from './helpers'

describe('rewritePathsByRewritingExtension', () => {
  it('should rewrite paths', () => {
    const paths = ['a.md', 'b.md', 'c.md']
    const rewriterHandler = rewritePathsByRewritingExtension('.md', '.html')
    const rewrittenPaths = []
    for (const path of paths)
      rewrittenPaths.push(rewriterHandler(undefined as any as Commit, path))

    expect(rewrittenPaths).toEqual(['a.html', 'b.html', 'c.html'])
  })

  it('should only rewrite paths with .md extension', () => {
    const paths = ['a.md', 'b.jpg', 'c']
    const rewriterHandler = rewritePathsByRewritingExtension('.md', '.html')
    const rewrittenPaths = []
    for (const path of paths)
      rewrittenPaths.push(rewriterHandler(undefined as any as Commit, path))

    expect(rewrittenPaths).toEqual(['a.html', 'b.jpg', 'c'])
  })

  it('should only rewrite paths ends with the desired extension', () => {
    const paths = ['a.md.jpg.md', 'b.html.md.html', 'c.md']
    const rewriterHandler = rewritePathsByRewritingExtension('.md', '.html')
    const rewrittenPaths = []
    for (const path of paths)
      rewrittenPaths.push(rewriterHandler(undefined as any as Commit, path))

    expect(rewrittenPaths).toEqual(['a.md.jpg.html', 'b.html.md.html', 'c.html'])
  })
})

describe('rewritePathsByPatterns', () => {
  it('should rewrite paths', async () => {
    const rewrittenPath = await rewritePathsByPatterns(
      undefined as any as Commit,
      'a.md',
      {
        handler: rewritePathsByRewritingExtension('.md', '.html'),
      },
    )

    expect(rewrittenPath).toBe('a.html')
  })
})

describe('parseGitLogRefsAsTags', () => {
  it('should return empty array if refs is not provided', () => {
    expect(parseGitLogRefsAsTags()).toEqual([])
  })

  it('should return parse one tag', () => {
    expect(parseGitLogRefsAsTags('tag: v1.0.0')).toEqual(['v1.0.0'])
  })

  it('should return empty when only HEAD', () => {
    expect(parseGitLogRefsAsTags('HEAD -> main')).toEqual([])
  })

  it('should return parse with HEAD', () => {
    expect(parseGitLogRefsAsTags('HEAD -> main, tag: v1.0.0')).toEqual(['v1.0.0'])
  })

  it('should return parse with multiple tags', () => {
    expect(parseGitLogRefsAsTags('HEAD -> main, tag: v1.0.0, tag: v1.0.1')).toEqual(['v1.0.0', 'v1.0.1'])
  })

  it('should return parse with multiple tags without HEAD', () => {
    expect(parseGitLogRefsAsTags('tag: v1.0.0, tag: v1.0.1')).toEqual(['v1.0.0', 'v1.0.1'])
  })
})

describe('parseRawCommitLogs', () => {
  it('should init commit with fields transformed', async () => {
    const mockedCommits = ['c16db1033fce57f50b261e9944c136a26fcaccc6|First Last|user@example.com|Mon Mar 25 20:05:53 2024 +0800|release: v1.24.3| (tag: v1.24.3)|Signed-off-by: First Last <user@example.com>\n']

    const commit = await parseRawCommitLogs('', mockedCommits)

    expect(commit).toEqual([{
      path: '',
      hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
      date: 'Mon Mar 25 20:05:53 2024 +0800',
      message: 'release: v1.24.3',
      refs: '(tag: v1.24.3)',
      body: 'Signed-off-by: First Last <user@example.com>',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }])
  })

  it('should return no commits when empty', async () => {
    const mockedCommit = [
      '', // empty commit, could occur when the file contains no history or git cli bugged
    ]
    const commit = await parseRawCommitLogs('', mockedCommit)

    expect(commit).toEqual([])
  })
})

describe('mergeRawCommits', () => {
  it('should merge commits by path', () => {
    const mockedCommits = [
      {
        path: '/fack/path/1.md',
        hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
        date: 'Mon Mar 25 20:05:53 2024 +0800',
        message: 'release: v1.24.3',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
      {
        path: '/fack/path/2.md',
        hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
        date: 'Mon Mar 25 20:05:53 2024 +0800',
        message: 'release: v1.24.3',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
    ]

    const commits = mergeRawCommits(mockedCommits)

    expect(commits).toEqual([
      {
        paths: ['/fack/path/1.md', '/fack/path/2.md'],
        hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
        date: 'Mon Mar 25 20:05:53 2024 +0800',
        message: 'release: v1.24.3',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
    ])
  })

  it('should convert path to paths', () => {
    const mockedCommits = [
      {
        path: '/fack/path/1.md',
        hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
        date: 'Mon Mar 25 20:05:53 2024 +0800',
        message: 'release: v1.24.3',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
      {
        path: '/fack/path/1.md',
        hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
        date: 'Wed Apr 24 14:24:44 2024 +0800',
        message: 'docs: fix english integrations list',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
    ]

    const commits = mergeRawCommits(mockedCommits)

    expect(commits).toEqual([
      {
        paths: ['/fack/path/1.md'],
        hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
        date: 'Mon Mar 25 20:05:53 2024 +0800',
        message: 'release: v1.24.3',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
      {
        paths: ['/fack/path/1.md'],
        hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
        date: 'Wed Apr 24 14:24:44 2024 +0800',
        message: 'docs: fix english integrations list',
        body: 'Signed-off-by: First Last <user@example.com>',
        author_name: 'First Last',
        author_email: 'user@example.com',
      },
    ])
  })
})

describe('parseCommitAuthors', () => {
  it('should parse author from raw commit', async () => {
    const mockedCommit = {
      paths: ['/fack/path/1.md'],
      hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
      date: 'Wed Apr 24 14:24:44 2024 +0800',
      message: 'docs: fix english integrations list',
      body: '',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }

    const authors = await parseCommitAuthors(mockedCommit)
    expect(authors).toEqual([{ name: 'First Last', email: 'user@example.com' }])
  })

  it('should parse co-author from body', async () => {
    const mockedCommit = {
      paths: ['/fack/path/1.md'],
      hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
      date: 'Wed Apr 24 14:24:44 2024 +0800',
      message: 'docs: fix english integrations list',
      body: 'Co-authored-by: First Last2 <user2@example.com>',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }

    const authors = await parseCommitAuthors(mockedCommit)
    expect(authors).toEqual([
      { name: 'First Last', email: 'user@example.com' },
      { name: 'First Last2', email: 'user2@example.com' },
    ])
  })

  it('should exclude bot user', async () => {
    const mockedCommit = {
      paths: ['/fack/path/1.md'],
      hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
      date: 'Wed Apr 24 14:24:44 2024 +0800',
      message: 'docs: fix english integrations list',
      body: '',
      author_name: 'renovate[bot]',
      author_email: 'renovate[bot]@renovate.com',
    }

    const authors = await parseCommitAuthors(mockedCommit)
    expect(authors).toEqual([])
  })
})

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

    const avatar = await newAvatarForAuthor(mappedAuthor, 'user@example.com')

    expect(avatar).toEqual('https://example.com/avatar.png')
  })

  it('should return the mapped author avatar with username', async () => {
    const mappedAuthor = {
      username: 'johndoe',
    }

    const avatar = await newAvatarForAuthor(mappedAuthor, 'user@example.com')

    expect(avatar).toEqual('https://github.com/johndoe.png')
  })

  it('should return the commit author avatar with email', async () => {
    const avatar = await newAvatarForAuthor(undefined, 'user@example.com')

    expect(avatar).toEqual('https://gravatar.com/avatar/b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514?d=retro')
  })
})

describe('parseCommits', () => {
  it('should init commit with fields transformed', async () => {
    const mockedCommits = ['c16db1033fce57f50b261e9944c136a26fcaccc6|First Last|user@example.com|Mon Mar 25 20:05:53 2024 +0800|release: v1.24.3| (tag: v1.24.3)|Signed-off-by: First Last <user@example.com>\n']

    const commit = await parseCommits(
      mockedCommits,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual([{
      path: '',
      tag: 'v1.24.3',
      tags: ['v1.24.3'],
      release_tag_url: 'https://github.com/example-org/example/releases/tag/v1.24.3',
      release_tags_url: ['https://github.com/example-org/example/releases/tag/v1.24.3'],
      hash: 'c16db1033fce57f50b261e9944c136a26fcaccc6',
      hash_url: 'https://github.com/example-org/example/commit/c16db1033fce57f50b261e9944c136a26fcaccc6',
      date: 'Mon Mar 25 20:05:53 2024 +0800',
      date_timestamp: 1711368353000,
      message: 'release: v1.24.3',
      body: 'Signed-off-by: First Last <user@example.com>',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
    }])
  })

  it('should transform for commit contains no refs', async () => {
    const mockedCommit = [
      '', // empty commit, could occur when the file contains no history or git cli bugged
      '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1|First Last|user@example.com|Wed Apr 24 14:24:44 2024 +0800|docs: fix english integrations list||Signed-off-by: First Last <user@example.com>\n',
    ]
    const commit = await parseCommits(
      '',
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual([{
      path: '',
      hash: '62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
      hash_url: 'https://github.com/example-org/example/commit/62ef7ed8f54ea1faeacf6f6c574df491814ec1b1',
      date: 'Wed Apr 24 14:24:44 2024 +0800',
      date_timestamp: 1713939884000,
      message: 'docs: fix english integrations list',
      body: 'Signed-off-by: First Last <user@example.com>',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
    }])
  })

  it('should transform for commit contains no body', async () => {
    const mockedCommit = [
      '', // empty commit, could occur when the file contains no history or git cli bugged
      'fa0fb328b988499c74983e9164f6db4e2e92afd8|First Last|user@example.com|Sun Apr 7 22:27:57 2024 +0800|release: v1.28.0| (tag: v1.28.0)|',
    ]
    const commit = await parseCommits(
      '',
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual([{
      path: '',
      hash: 'fa0fb328b988499c74983e9164f6db4e2e92afd8',
      date: 'Sun Apr 7 22:27:57 2024 +0800',
      date_timestamp: 1712500077000,
      message: 'release: v1.28.0',
      body: '',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
      hash_url: 'https://github.com/example-org/example/commit/fa0fb328b988499c74983e9164f6db4e2e92afd8',
      tags: ['v1.28.0'],
      tag: 'v1.28.0',
      release_tag_url: 'https://github.com/example-org/example/releases/tag/v1.28.0',
      release_tags_url: ['https://github.com/example-org/example/releases/tag/v1.28.0'],
    }])
  })

  it('should return no commits when empty', async () => {
    const mockedCommit = [
      '', // empty commit, could occur when the file contains no history or git cli bugged
    ]
    const commit = await parseCommits(
      '',
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual([])
  })
})
