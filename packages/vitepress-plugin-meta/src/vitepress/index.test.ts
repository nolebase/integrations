import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import type { TransformContext } from 'vitepress'
import { transformHeadMeta } from '.'

describe('meta', () => {
  it('should return an array of head elements for en', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.en.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({ length: 100 })([], {
      content: contentStr,
      pageData: { },
      siteConfig: { site: { description: 'Test' } },
    } as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
      ['meta', { property: 'og:description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
      ['meta', { property: 'twitter:description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
    ])
  })

  it('should return an array of head elements for zh-CN', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.zh-CN.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({ length: 100 })([], {
      content: contentStr,
      pageData: {},
      siteConfig: { site: { description: '站点测试介绍' } },
    } as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
      ['meta', { property: 'og:description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
      ['meta', { property: 'twitter:description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
    ])
  })

  it('should use tagline for layout home', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.en.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({
      length: 100,
    })([], {
      content: contentStr,
      pageData: { frontmatter: { layout: 'home', hero: { tagline: 'Tagline Description' } } },
      siteConfig: { site: { description: 'Test' } },
    } as unknown as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: 'Tagline Description' }],
      ['meta', { property: 'og:description', content: 'Tagline Description' }],
      ['meta', { property: 'twitter:description', content: 'Tagline Description' }],
    ])
  })

  it('should fallback to site description when tagline is absent for layout home', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.zh-CN.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({
      length: 100,
    })([], {
      content: contentStr,
      pageData: { frontmatter: { layout: 'home' } },
      siteConfig: { site: { description: 'Test' } },
    } as unknown as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: 'Test' }],
      ['meta', { property: 'og:description', content: 'Test' }],
      ['meta', { property: 'twitter:description', content: 'Test' }],
    ])
  })

  it('should not use tagline for layout home', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.zh-CN.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({
      length: 100,
      useTaglineForHomeLayout: false,
    })([], {
      content: contentStr,
      pageData: { frontmatter: { layout: 'home', hero: { tagline: 'Tagline Description' } } },
      siteConfig: { site: { description: 'Test' } },
    } as unknown as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
      ['meta', { property: 'og:description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
      ['meta', { property: 'twitter:description', content: '快速开始 ​你可以通过前往集成页面来寻找你感兴趣的集成，然后按照对应的集成的文档进行操作和配置。首先，请在你的 VitePress 核心配置文件 中（注意不是主题配置文件，通常为 docs/.vite...' }],
    ])
  })

  it('should be about to override by handleExcerpt', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.en.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({
      length: 100,
      handleExcerpt: async () => {
        return 'This is a test description'
      },
    })([], {
      content: contentStr,
      pageData: {},
      siteConfig: { site: { description: 'Test' } },
    } as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: 'This is a test description' }],
      ['meta', { property: 'og:description', content: 'This is a test description' }],
      ['meta', { property: 'twitter:description', content: 'This is a test description' }],
    ])
  })

  it('should not push duplicated head meta elements if present', async () => {
    const content = await readFile('packages/vitepress-plugin-meta/src/vitepress/testdata/index.en.html')
    const contentStr = content.toString('utf-8')

    const head = await transformHeadMeta({
      length: 100,
    })([
      ['meta', { name: 'description', content: 'Already present' }],
      ['meta', { property: 'og:description', content: 'Already present' }],
    ], {
      content: contentStr,
      pageData: {},
      siteConfig: { site: { description: 'Test' } },
    } as TransformContext)
    expect(head).toMatchObject([
      ['meta', { name: 'description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
      ['meta', { property: 'og:description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
      ['meta', { property: 'twitter:description', content: 'Getting Started ​You could find the integration you interested in by navigating to the Integrations...' }],
    ])
  })
})
