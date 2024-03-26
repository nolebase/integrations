# Bi-directional Links <Badge type="tip" text="v1.25.0" />

## Demo

[[Bi-directional Links Example Page]]

Custom text: [[Bi-directional Links Example Page|Custom Text]]

Compatible to modify the HTML attributes [[Bi-directional Links Example Page|Custom Attrs]]{style="color: red;"}

Obsidian same name pages: [[pages/en/integrations/markdown-it-bi-directional-links/same-name/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]] 和 [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Same Name Page|Bi-directional Links Example Same Name Page]]

Absolute Path: [[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page]]

Images are supported:

![[foxtail field.jpg]]

## Introduction

**Bi-directional links** (also known as internal links), and another concept you may know and hear about [WikiLinks](https://en.wikipedia.org/wiki/Help:Link), holds a important place in the document engineering area. It is usually used to quickly establish a connection (or link) from one page to another page, and widely used in Wiki pages such as [Wikipedia](https://wikipedia.org), and now days popular tools such as [Obsidian](https://obsidian.md/) and [Logseq](https://logseq.com/).

This plugin is a fully featured compatible implementation version of [Obsidian](https://obsidian.md)'s [internal links](https://help.obsidian.md/Linking+notes+and+files/Internal+links), it follows two rules:

1. A page's file name (without extension) can be used as a link target, for example: `[[Bi-directional Links Example Page]]` will be parsed as a link to the globally unique `Bi-directional Links Example Page.md` file.
2. A link target can be an absolute path, for example: `[[Some Folder/Bi-directional Links Example Page]]` will be parsed as a link to `Some Folder/Bi-directional Links Example Page.md`, usually appears when you have multiple files with the same name.

### Examples

<br>

#### Basic

```markdown
[[Target Page File Name]]
```

Demo

[[Bi-directional Links Example Page]]

##### Image

```markdown
![[foxtail field.jpg]]
```

Demo

![[foxtail field.jpg]]

#### Custom Text

```markdown
[[Target Page File Name|Custom Text]]
```

Demo

[[Bi-directional Links Example Page|Custom Text]]

#### Compatible with [`markdown-it-attrs`](https://github.com/arve0/markdown-it-attrs) to modify HTML attributes

<br>

##### Change color

```markdown
[[Target Page File Name]]{style="color: red;"}
```

Demo

[[Bi-directional Links Example Page]]{style="color: red;"}

##### Change class name

```markdown
[[Target Page File Name]]{.custom-class}
```

Demo

[[Bi-directional Links Example Page]]{.custom-class}

### Absolute path

```markdown
[[Some Full Path Reference to Your Page]]
```

Demo

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page]]

#### Image

```markdown
![[en/integrations/markdown-it-bi-directional-links/images/railway near by beach same name.jpg]]
```

Demo

![[pages/en/integrations/markdown-it-bi-directional-links/images/railway near by beach same name.jpg]]

And it is distinguishable to the pictures with the same name:

```markdown
![[en/integrations/markdown-it-bi-directional-links/images/same-name/railway near by beach same name.jpg]]
```

Demo

![[pages/en/integrations/markdown-it-bi-directional-links/images/same-name/railway near by beach same name.jpg]]

### Absolute path with custom text

```markdown
[[Some Full Path Reference to Your Page|Custom Text]]
```

Demo

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|Custom Text]]

### Use Markdown markup in custom text

```markdown
[[Some Full Path Reference to Your Page|`Code Block (Before)` Middle `Code Block (After)`]]

[[Some Full Path Reference to Your Page|**Bold Before** Middle **Bold After**]]

[[Some Full Path Reference to Your Page|*Italic Before* Middle *After*]]

[[Some Full Path Reference to Your Page|~~Strikethrough Before~~ Middle ~~Strikethrough After~~]]

[[Some Full Path Reference to Your Page|<span style="color: red;">Custom HTML</span>]]

[[Some Full Path Reference to Your Page|<span style="color: red;">Custom HTML (Before)</span> Middle <span style="color: blue;">Custom HTML (After)</span>]]
```

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|`Code Block (Before)` Middle `Code Block (After)`]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|**Bold (Before)** Middle **Bold (After)**]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|*Italic (Before)* Middle *Italic (After)*]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|~~Strikethrough (Before)~~ Middle ~~Strikethrough (After)~~]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span>]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span> Middle <span style="color: blue;">Custom HTML</span>]]

## How to use

### Installation

Install `@nolebase/markdown-it-bi-directional-links` to your project dependencies by running the following command:

::: code-group

```shell [pnpm]
pnpm add @nolebase/markdown-it-bi-directional-links -D
```

```shell [npm]
npm install @nolebase/markdown-it-bi-directional-links -D
```

```shell [yarn]
yarn add @nolebase/markdown-it-bi-directional-links -D
```

:::

### Integrate with VitePress

In the VitePress configuration file (usually `docs/.vitepress/config.ts`, the file path and extension may be different), import `@nolebase/markdown-it-bi-directional-links` as a plugin, and use it as a `markdown-it` plugin in the `markdown` option:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

```typescript
import process from 'node:process' // [!code ++]
import { defineConfigWithTheme } from 'vitepress'
import { MarkdownItBiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]

export default defineConfigWithTheme({
  lang: 'en',
  title: 'Site name', // For reference only, please do not copy directly
  description: 'Description', // For reference only, please do not copy directly
  themeConfig: {
    // Other configurations...
  },
  markdown: {
    config: (md) => {
      md.use(MarkdownItBiDirectionalLinks({ // [!code ++]
        dir: process.cwd(), // [!code ++]
      })) // [!code ++]
    },
  },
})
```

### Integrate on-demand

<!--@include: @/pages/en/snippets/configure-on-your-own-warning.md-->

Import this plugin into the file where you can access the [`markdown-it`](https://github.com/markdown-it/markdown-it) instance, and use it as a `markdown-it` plugin:

```typescript
import { MarkdownItBiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links' // [!code ++]
```

Then you need to use the `use()` member methods from the `markdown-it` instance to use this plugin.
With a options object that contains a `dir` field which is the root directory of your project supplied, the value for `dir` field can be obtained through `cwd()` function call that imported from either `process` or `node:process`:

```typescript
import MarkdownItBiDirectionalLinks from '@nolebase/markdown-it-bi-directional-links'
import { cwd } from 'process' // [!code ++]

// Rest of the code...

markdownIt.use(MarkdownItBiDirectionalLinks({ // [!code ++]
  dir: process.cwd() // [!code ++]
})) // [!code ++]
```
