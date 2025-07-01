import MarkdownIt from 'markdown-it'
import MarkdownItAttrs from 'markdown-it-attrs'

import { describe, expect, it } from 'vitest'

import { InlineLinkPreviewElementTransform } from '.'

describe('markdown-it', () => {
  function expectWrapper(result: string) {
    return `<p>${result}</p>\n`
  }

  const cases = [
    {
      name: 'should render link markup',
      input: '[foo](foo)',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render link markup with other attributes',
      input: '[foo](foo){.bar}',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" class="bar">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should not render link markup when header-anchor in class',
      input: '[foo](foo){.header-anchor}',
      expect: expectWrapper('<a href="foo" class="header-anchor">foo</a>'),
    },
    {
      name: 'should not render link markup when no-inline-link-preview in class',
      input: '[foo](foo){.no-inline-link-preview}',
      expect: expectWrapper('<a href="foo" class="no-inline-link-preview">foo</a>'),
    },
    {
      name: 'should not render link markup when data-inline-link-preview="false" attribute exist',
      input: '[foo](foo){data-inline-link-preview=false}',
      expect: expectWrapper('<a href="foo" data-inline-link-preview="false">foo</a>'),
    },
    {
      name: 'should render a element',
      input: '<a href="foo">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render a element with other attributes',
      input: '<a href="foo" style="color: red;">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" style="color: red;">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should not render a element when header-anchor in class',
      input: '<a href="foo" class="some-class header-anchor some-other-class">foo</a>',
      expect: expectWrapper('<a href="foo" class="some-class header-anchor some-other-class">foo</a>'),
    },
    {
      name: 'should not render a element when no-inline-link-preview in class',
      input: '<a href="foo" class="some-class no-inline-link-preview some-other-class">foo</a>',
      expect: expectWrapper('<a href="foo" class="some-class no-inline-link-preview some-other-class">foo</a>'),
    },
    {
      name: 'should not render a element when no-inline-link-preview is class',
      input: '<a href="foo" class="no-inline-link-preview">foo</a>',
      expect: expectWrapper('<a href="foo" class="no-inline-link-preview">foo</a>'),
    },
    {
      name: 'should render a element when a-no-inline-link-preview in class',
      input: '<a href="foo" class="a-no-inline-link-preview some-other-class">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" class="a-no-inline-link-preview some-other-class">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render a element when a-no-inline-link-preview is class',
      input: '<a href="foo" class="a-no-inline-link-preview">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" class="a-no-inline-link-preview">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render a element when no-inline-link-preview-b in class',
      input: '<a href="foo" class="no-inline-link-preview-b some-other-class">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" class="no-inline-link-preview-b some-other-class">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render a element when no-inline-link-preview-b is class',
      input: '<a href="foo" class="no-inline-link-preview-b">foo</a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="foo" class="no-inline-link-preview-b">foo</VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should render img element',
      input: '<a href="/img/es-feature.png" target="_blank"><img src="/img/es-feature.png" /></a>',
      expect: expectWrapper('<VPNolebaseInlineLinkPreview href="/img/es-feature.png" target="_blank"><img src="/img/es-feature.png" /></VPNolebaseInlineLinkPreview>'),
    },
    {
      name: 'should not render a element when data-inline-link-preview="false" attribute exist',
      input: '<a href="foo" data-inline-link-preview="false">foo</a>',
      expect: expectWrapper('<a href="foo" data-inline-link-preview="false">foo</a>'),
    },
    {
      name: 'should not render a element when data-inline-link-preview="false" attribute exist with other attributes',
      input: '<a href="foo" data-inline-link-preview="false" data-abcd="abcd">foo</a>',
      expect: expectWrapper('<a href="foo" data-inline-link-preview="false" data-abcd="abcd">foo</a>'),
    },
    {
      name: 'should not render a element when data-inline-link-preview="false" attribute exist with other class',
      input: '<a href="foo" class="abcd" data-inline-link-preview="false">foo</a>',
      expect: expectWrapper('<a href="foo" class="abcd" data-inline-link-preview="false">foo</a>'),
    },
  ]

  for (const tc of cases) {
    it(tc.name, () => {
      const rendered = new MarkdownIt({ html: true })
        .use(InlineLinkPreviewElementTransform)
        .use(MarkdownItAttrs)
        .render(tc.input)

      expect(rendered).toBe(tc.expect)
    })
  }
})
