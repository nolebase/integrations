---
title: Bi-directional Links
category: Bi-directional Links
sidebarTitle: Syntax
---

# Syntax

The following syntaxes are supported:

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Basic syntax</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Links with hash tags <code>#</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Links with query strings <code>?</code></span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Images</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Images size</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Custom text</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Custom HTML attributes</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Same name pages</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Absolute path</span>
</div>

## Basic Syntax

The syntax is the same as what [Internal links - Obsidian Help](https://help.obsidian.md/Linking+notes+and+files/Internal+links) supported and simple to write:

```markdown
[[Bi-directional Links Example Page]]
```

The `Bi-directional Links Example Page` is the file name of the target page. The rendered result will be:

[[Bi-directional Links Example Page]]

## link url

### Hash tags

::: info What is the targeted title? How does this feature work?

When you click on the link in the outline on the right or directly click the link button on the left of the title, pay attention to the changes in the address bar.

You will find that there is a `#` symbol in the URL, followed by an ID, which is the ID of the targeted title.

The ID of the targeted title mentioned here is actually the ID of the HTML element, so in theory, not only can the framework and the browser be required to scroll the title element into the viewport, but also other valid elements with matching HTML IDs.

This kind of element can be found by pressing <kbd>F12</kbd> to open the developer tool, and then enter

```js
document.querySelector('#why')
```

in the console to find it. This code will return an HTML element, which is what we call the "targeted title".

:::

We support this feature ass well, syntax reference here: [Link to a heading in a note - Internal links - Obsidian Help](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link+to+a+heading+in+a+note)

::: tip

Such functionalities is quite useful when you want to jump to a specific section once the page is opened and loaded.

With the use of the [Blinking highlight targeted heading](/pages/en/integrations/vitepress-plugin-highlight-targeted-heading/) VitePress plugin we provided, hence enhanced abilities and improved reading experience. The targeted title by hash tag will be highlighted with a blinking effect once the page is loaded.

:::

```markdown
[[Bi-directional Links Example Page#heading-id]]
```

The `section-2` is the hash tag of the target page. By default, the hash tag will be the `id` attribute of the heading element.

The rendered result will be:

[[Bi-directional Links Example Page#section-2]]

Or leave the page section blank and directly fill in `#<heading>` to indicate a jump to the specified heading of the current page, such as:

[[#basic-syntax]]

### Query strings

Beyond the default behaviors that Obsidian supported, we also support query strings in the link target. This is useful when you have a inner Vue component or JavaScript logic that can handle the query strings as part of the automation:

```markdown
[[Bi-directional Links Example Page?query=string]]
```

The rendered result will be:

[[Bi-directional Links Example Page?query=string]]

### Absolute path

```markdown
[[Some Full Path Reference to Your Page]]
```

Demo

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page]]

### Show Image

Adding `!` in front of `[[...]]` can display the picture, video, audio.

```markdown
![[foxtail field.jpg]]
```

Demo

![[foxtail field.jpg]]

## Additional attributes

This part is optional.

### Media Size

(It takes effect for pictures and video links)

```markdown
![[foxtail field.jpg|pic alt(option)|200x200]]
```

Among them, `200x0` or `0x200` respectively indicate setting only the width or heigh.

Demo

![[foxtail field.jpg|pic alt(option)|200x200]]

### Custom Text

```markdown
[[Bi-directional Links Example Page]]
```

Demo

[[Bi-directional Links Example Page|Custom Text]]

For jump links, this is the displayed text.
For the display of pictures or videos, etc., this is the alt attribute.
(It is displayed when the object cannot be rendered)

#### Use Markdown markup in custom text

```markdown
[[Some Full Path Reference to Your Page|`Code Block (Before)` Middle `Code Block (After)`]]

[[Some Full Path Reference to Your Page|**Bold Before** Middle **Bold After**]]

[[Some Full Path Reference to Your Page|*Italic Before* Middle *After*]]

[[Some Full Path Reference to Your Page|~~Strikethrough Before~~ Middle ~~Strikethrough After~~]]
```

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|`Code Block (Before)` Middle `Code Block (After)`]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|**Bold (Before)** Middle **Bold (After)**]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|*Italic (Before)* Middle *Italic (After)*]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|~~Strikethrough (Before)~~ Middle ~~Strikethrough (After)~~]]

#### Use HTML markup in custom text

```markdown
[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span>]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span> Middle <span style="color: blue;">Custom HTML</span>]]
```

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span>]]

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|<span style="color: red;">Custom HTML</span> Middle <span style="color: blue;">Custom HTML</span>]]

### Compatible with [`markdown-it-attrs`](https://github.com/arve0/markdown-it-attrs) to modify HTML attributes

<br>

#### Change color

```markdown
[[Bi-directional Links Example Page]]{style="color: red;"}
```

Demo

[[Bi-directional Links Example Page]]{style="color: red;"}

#### Change class name

```markdown
[[Bi-directional Links Example Page]]{.custom-class}
```

Demo

[[Bi-directional Links Example Page]]{.custom-class}

## More demo

### Image with absolute path

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

### Audio with absolute path

```markdown
![[pages/en/integrations/markdown-it-bi-directional-links/audios/Applause.mp3]]
```

Demo

![[pages/en/integrations/markdown-it-bi-directional-links/audios/Applause.mp3]]

### Video with absolute path

```markdown
![[pages/en/integrations/markdown-it-bi-directional-links/videos/Big rabbit came out of the hutch.mp4]]
```

Demo

![[pages/en/integrations/markdown-it-bi-directional-links/videos/Big rabbit came out of the hutch.mp4]]

### Absolute path with custom text

```markdown
[[Some Full Path Reference to Your Page|Custom Text]]
```

Demo

[[pages/en/integrations/markdown-it-bi-directional-links/Bi-directional Links Example Page|Custom Text]]
