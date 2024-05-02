import { describe, expect, it } from 'vitest'

import type { Commit } from '../types'
import {
  defaultCommitURLHandler,
  defaultReleaseTagURLHandler,
  defaultReleaseTagsURLHandler,
  generateCommitPathsRegExp,
  parseCommits,
  parseGitLogRefsAsTags,
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

// describe('generateCommitPathsRegExp', () => {
//   it('default', () => {
//     expect(generateCommitPathsRegExp([], [])).toEqual(/^.+.md$/)
//   })
//   it('includeDirs', () => {
//     expect(generateCommitPathsRegExp(['docs', 'packages'], [])).toEqual(/^(docs|packages)\/.+.md$/)
//   })
//   it('includeExtensions', () => {
//     expect(generateCommitPathsRegExp([], ['.md', '.ts'])).toEqual(/^.+(.md|.ts)$/)
//   })
//   it('includeDirs and includeExtensions', () => {
//     expect(generateCommitPathsRegExp(['docs', 'packages'], ['.md', '.ts'])).toEqual(/^(docs|packages)\/.+(.md|.ts)$/)
//   })
// })

describe('parseCommits', () => {
  it('should init commit with fields transformed', async () => {
    const mockedCommits = ['c16db1033fce57f50b261e9944c136a26fcaccc6|Neko Ayaka|neko@ayaka.moe|Mon Mar 25 20:05:53 2024 +0800|release: v1.24.3| (tag: v1.24.3)|Signed-off-by: Neko Ayaka <neko@ayaka.moe>\n']

    const commit = await parseCommits(
      '',
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
      body: 'Signed-off-by: Neko Ayaka <neko@ayaka.moe>\n',
      author_name: 'Neko Ayaka',
      author_email: 'neko@ayaka.moe',
      author_avatar: '8002ecc992a1c4aba4c49fd04ea4b48ecf2468b85d3b9cdd6dae4163bf1bb945',
      repo_url: 'https://github.com/example-org/example',
    }])
  })

  it('should transform for commit contains no refs', async () => {
    const mockedCommit = ['62ef7ed8f54ea1faeacf6f6c574df491814ec1b1|Neko Ayaka|neko@ayaka.moe|Wed Apr 24 14:24:44 2024 +0800|docs: fix english integrations list||Signed-off-by: Neko Ayaka <neko@ayaka.moe>\n']
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
      body: 'Signed-off-by: Neko Ayaka <neko@ayaka.moe>\n',
      author_name: 'Neko Ayaka',
      author_email: 'neko@ayaka.moe',
      author_avatar: '8002ecc992a1c4aba4c49fd04ea4b48ecf2468b85d3b9cdd6dae4163bf1bb945',
      repo_url: 'https://github.com/example-org/example',
    }])
  })

  it('should transform for commit contains no body', async () => {
    const mockedCommit = ['fa0fb328b988499c74983e9164f6db4e2e92afd8|Rizumu Ayaka|rizumu@ayaka.moe|Sun Apr 7 22:27:57 2024 +0800|release: v1.28.0| (tag: v1.28.0)|']
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
      author_name: 'Rizumu Ayaka',
      author_email: 'rizumu@ayaka.moe',
      author_avatar: '898fff9a9daaaad0a2bf6e1ae59a3610189b9ec42a7bc6c26c7e9f855cf8576e',
      repo_url: 'https://github.com/example-org/example',
      hash_url: 'https://github.com/example-org/example/commit/fa0fb328b988499c74983e9164f6db4e2e92afd8',
      tags: ['v1.28.0'],
      tag: 'v1.28.0',
      release_tag_url: 'https://github.com/example-org/example/releases/tag/v1.28.0',
      release_tags_url: ['https://github.com/example-org/example/releases/tag/v1.28.0'],
    }])
  })
})
