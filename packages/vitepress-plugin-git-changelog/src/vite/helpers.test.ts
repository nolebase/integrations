import { describe, expect, it } from 'vitest'

import type { Commit } from '../types'
import {
  defaultCommitURLHandler,
  defaultReleaseTagURLHandler,
  defaultReleaseTagsURLHandler,
  generateCommitPathsRegExp,
  initCommitWithFieldsTransformed,
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

describe('generateCommitPathsRegExp', () => {
  it('default', () => {
    expect(generateCommitPathsRegExp([], [])).toEqual(/^.+.md$/)
  })
  it('includeDirs', () => {
    expect(generateCommitPathsRegExp(['docs', 'packages'], [])).toEqual(/^(docs|packages)\/.+.md$/)
  })
  it('includeExtensions', () => {
    expect(generateCommitPathsRegExp([], ['.md', '.ts'])).toEqual(/^.+(.md|.ts)$/)
  })
  it('includeDirs and includeExtensions', () => {
    expect(generateCommitPathsRegExp(['docs', 'packages'], ['.md', '.ts'])).toEqual(/^(docs|packages)\/.+(.md|.ts)$/)
  })
})

describe('initCommitWithFieldsTransformed', () => {
  it('should init commit with fields transformed', async () => {
    const mockedCommit = {
      hash: '0e4565940b08cc145d378169e85c37eca20d6036',
      date: '2023-11-10T11:59:06+08:00',
      message: 'release: v1.0.0',
      refs: 'tag: v1.0.0',
      body: 'Signed-off-by: First Last <user@example.com>\n',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }

    const commit = await initCommitWithFieldsTransformed(
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual({
      paths: [],
      tag: 'v1.0.0',
      tags: ['v1.0.0'],
      release_tag_url: 'https://github.com/example-org/example/releases/tag/v1.0.0',
      release_tags_url: ['https://github.com/example-org/example/releases/tag/v1.0.0'],
      hash: '0e4565940b08cc145d378169e85c37eca20d6036',
      hash_url: 'https://github.com/example-org/example/commit/0e4565940b08cc145d378169e85c37eca20d6036',
      date: '2023-11-10T11:59:06+08:00',
      date_timestamp: 1699588746000,
      message: 'release: v1.0.0',
      refs: 'tag: v1.0.0',
      body: 'Signed-off-by: First Last <user@example.com>\n',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
    })
  })

  it('should transform for commit contains no refs', async () => {
    const mockedCommit = {
      hash: '77be05bfb36ce894638648bf5530122b31b951f8',
      date: '2023-10-29T19:52:13+08:00',
      message: 'docs: updated README.md',
      refs: '',
      body: 'Signed-off-by: First Last <user@example.com>\n',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }
    const commit = await initCommitWithFieldsTransformed(
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual({
      paths: [],
      hash: '77be05bfb36ce894638648bf5530122b31b951f8',
      hash_url: 'https://github.com/example-org/example/commit/77be05bfb36ce894638648bf5530122b31b951f8',
      date: '2023-10-29T19:52:13+08:00',
      date_timestamp: 1698580333000,
      message: 'docs: updated README.md',
      refs: '',
      body: 'Signed-off-by: First Last <user@example.com>\n',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
    })
  })

  it('should transform for commit contains no body', async () => {
    const mockedCommit = {
      hash: '485f621e56a1c799d6081e00f901a43bd4935d5a',
      date: '2023-11-05T21:38:23+08:00',
      message: 'release: v1.0.0',
      refs: 'tag: v1.0.0',
      body: '',
      author_name: 'First Last',
      author_email: 'user@example.com',
    }
    const commit = await initCommitWithFieldsTransformed(
      mockedCommit,
      () => 'https://github.com/example-org/example',
      defaultCommitURLHandler,
      defaultReleaseTagURLHandler,
      defaultReleaseTagsURLHandler,
    )

    expect(commit).toEqual({
      paths: [],
      tag: 'v1.0.0',
      tags: ['v1.0.0'],
      release_tag_url: 'https://github.com/example-org/example/releases/tag/v1.0.0',
      release_tags_url: ['https://github.com/example-org/example/releases/tag/v1.0.0'],
      hash: '485f621e56a1c799d6081e00f901a43bd4935d5a',
      hash_url: 'https://github.com/example-org/example/commit/485f621e56a1c799d6081e00f901a43bd4935d5a',
      date: '2023-11-05T21:38:23+08:00',
      date_timestamp: 1699191503000,
      message: 'release: v1.0.0',
      refs: 'tag: v1.0.0',
      body: '',
      author_name: 'First Last',
      author_email: 'user@example.com',
      author_avatar: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
      repo_url: 'https://github.com/example-org/example',
    })
  })
})
