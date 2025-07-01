import type { PageData, TransformPageContext } from 'vitepress'

import { expect, it } from 'vitest'

import { generateBreadcrumbsData } from '../vitepress'

it('page is not index', () => {
  const pageData = {
    relativePath: 'a/b/c/d.md',
    filePath: 'a/b/c/d.md',
    title: 'd',
    frontmatter: {},
  } as PageData

  const context = {
    siteConfig: {
      site: {
        title: 'Home',
      },
      pages: ['a', 'a/b', 'a/b/index.md', 'a/b/c/d.md'],
    },
  } as TransformPageContext

  generateBreadcrumbsData(pageData, context)

  expect(pageData.frontmatter.breadcrumbs).toEqual([
    { title: 'Home', link: '/a' },
    { title: 'b', link: '/a/b' },
    { title: 'c', link: '' },
    { title: 'd', link: '/a/b/c/d' },
  ])
})

it('page is index', () => {
  const pageData = {
    relativePath: 'a/b/c/d/index.md',
    filePath: 'a/b/c/d/index.md',
    title: 'd',
    frontmatter: {},
  } as PageData

  const context = {
    siteConfig: {
      site: {
        title: 'Home',
      },
      pages: ['a', 'a/b', 'a/b/index.md', 'a/b/c/d/index.md'],
    },
  } as TransformPageContext

  generateBreadcrumbsData(pageData, context)

  expect(pageData.frontmatter.breadcrumbs).toEqual([
    { title: 'Home', link: '/a' },
    { title: 'b', link: '/a/b' },
    { title: 'c', link: '' },
    { title: 'd', link: '/a/b/c/d' },
  ])
})
