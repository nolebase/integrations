import { describe, expect, it } from 'vitest'

import { rewritePathsByRewritingExtension } from './git'

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
