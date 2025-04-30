---
title: 双向链接
category: 双向链接
sidebarTitle: 语法
---

# 语法

当前支持以下语法：

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>基本语法</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>带有 hash tags <code>#</code> 的链接</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>带有 query strings <code>?</code> 的链接</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>图片双链</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>图片尺寸</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>自定义文案</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>自定义 HTML 属性</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>同名文件语法</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>绝对路径语法</span>
</div>

## 基本语法

其语法与 [Internal links - Obsidian Help](https://help.obsidian.md/Linking+notes+and+files/Internal+links)支持的语法相同，编写起来也很简单：

```markdown
[[双向链接示例页面]]
```

其中，`双向链接示例页面` 是目标页面的文件名。

渲染结果将是这样的：

[[双向链接示例页面]]

## 链接 url

### Hash tag（标题选择器）

::: info 目标标题是什么？这样的功能是如何工作的？

当点击右侧大纲内的链接或者直接点击标题左侧的链接按钮的时候，注意观察地址栏中的变化。

你会发现 URL 中会出现一个 `#` 符号，后面跟着一个 ID，这个 ID 就是目标标题的 ID。

这里说的目标标题的 ID 其实就是 HTML 元素的 ID，所以理论上不光是可以要求框架和浏览器配合着去滚动标题元素到视窗内，也可以是其他有效的带有匹配得上 HTML ID 的元素。

这样的元素可以通过按下 <kbd>F12</kbd> 打开开发者工具，然后在控制台中输入

```js
document.querySelector('#为什么')
```

来查找到，这段代码将会返回一个 HTML 元素，这个元素就是我们说的「目标标题」。

:::

我们也支持这一功能，语法参考此处：[链接到注释中的标题 - 内部链接 - Obsidian 帮助](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link+to+a+heading+in+a+note)。

::: tip

当您想要在当页面打开并加载后跳转到特定部分时，这种功能就非常有用了。

搭配使用我们提供的 [闪烁高亮当前的目标标题](/pages/zh-CN/integrations/vitepress-plugin-highlight-targeted-heading/) VitePress 插件时，hash tag 选中的标题（双链指向的标题）将在页面加载后以闪烁的效果突出显示，从而增强能力和阅读体验。

:::

```markdown
[[双向链接示例页面#标题-id]]
```

`标题-id` 是目标页面的哈希标签。默认情况下，哈希标签将是标题元素的 `id` 属性。

渲染结果将是这样的：

[[双向链接示例页面#章节-2]]

或者不写页面部分，直接填写 `#<heading>` 表示跳转到当前页面的指定标题，如：

[[#基本语法]]

### 查询字符串

除了 Obsidian 支持的默认行为外，我们还支持「查询字符串」。

这对于页面内引用了 Vue 组件或 JavaScript 逻辑的页面或者设计而言，可以将查询字符串作为自动化的一部分来处理，这将非常有用：

```markdown
[[双向链接示例页面?query=string]]
```

渲染结果将是这样的：

[[双向链接示例页面?query=string]]

### 绝对路径

```markdown
[[某个完整路径]]
```

效果

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面]]

### 显示图片

在 `[[...]]` 前面添加 `!` 可以显示图片、视频、音频等。

```markdown
![[一片 狗尾草.jpg]]
```

效果

![[一片 狗尾草.jpg]]

## 额外属性

这部分是可选的。

### 显示大小

（对图片和视频链接生效）

```markdown
![[一片 狗尾草.jpg|图片名(可省略)|200x200]]
```

其中 `200x0` 或 `0x200` 分别表示仅设置宽或高。

效果

![[一片 狗尾草.jpg|图片名(可省略)|200x200]]

### 自定义显示的文案

```markdown
[[双向链接示例页面|自定义文案]]
```

效果

[[双向链接示例页面|自定义文案]]

对于跳转链接来说，这是显示的文字。对于图片或视频等显示来说，这是 alt 属性
(用于对象无法渲染时显示)

#### 自定义文案中使用 Markdown 语法

```markdown
[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|`代码块（前缀）` 中间的内容 `代码块（后缀）`]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|**粗体（前缀）** 中间的内容 **粗体（后缀）**]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|*斜体（前缀）* 中间的内容 *斜体（后缀）*]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|~~删除线（前缀）~~ 中间的内容 ~~删除线（后缀）~~]]
```

效果

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|`代码块（前缀）` 中间的内容 `代码块（后缀）`]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|**粗体（前缀）** 中间的内容 **粗体（后缀）**]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|*斜体（前缀）* 中间的内容 *斜体（后缀）*]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|~~删除线（前缀）~~ 中间的内容 ~~删除线（后缀）~~]]

#### 自定义文案中使用 HTML 语法

```markdown
[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|<span style="color: red;">自定义 HTML</span>]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|<span style="color: red;">自定义 HTML</span> 中间的内容 <span style="color: blue;">自定义 HTML</span>]]
```

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|<span style="color: red;">自定义 HTML</span>]]

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|<span style="color: red;">自定义 HTML</span> 中间的内容 <span style="color: blue;">自定义 HTML</span>]]

### 兼容 [`markdown-it-attrs`](https://github.com/arve0/markdown-it-attrs) 修改 HTML 属性（Attribute）

<br>

#### 改颜色

```markdown
[[双向链接示例页面]]{style="color: red;"}
```

效果

[[双向链接示例页面]]{style="color: red;"}

#### 改类名

```markdown
[[双向链接示例页面]]{.some-class}
```

效果

[[双向链接示例页面]]{.some-class}

## 更多案例

### 图片配合绝对路径

```markdown
![[zh-CN/integrations/markdown-it-bi-directional-links/images/海滩铁轨 同名图片.jpg]]
```

效果

![[pages/zh-CN/integrations/markdown-it-bi-directional-links/images/海滩铁轨 同名图片.jpg]]

它与同名图片是可以区分的：

```markdown
![[zh-CN/integrations/markdown-it-bi-directional-links/images/same-name/海滩铁轨 同名图片.jpg]]
```

效果

![[pages/zh-CN/integrations/markdown-it-bi-directional-links/images/same-name/海滩铁轨 同名图片.jpg]]

### 音频配合绝对路径

```markdown
![[pages/zh-CN/integrations/markdown-it-bi-directional-links/audios/鼓掌声.mp3]]
```

效果

![[pages/zh-CN/integrations/markdown-it-bi-directional-links/audios/鼓掌声.mp3]]

### 视频配合绝对路径

```markdown
![[pages/zh-CN/integrations/markdown-it-bi-directional-links/videos/大兔子从兔窝中钻出.mp4]]
```

效果

![[pages/zh-CN/integrations/markdown-it-bi-directional-links/videos/大兔子从兔窝中钻出.mp4]]

### 绝对路径和自定义文案

```markdown
[[某个文件夹|自定义文案]]
```

效果

[[pages/zh-CN/integrations/markdown-it-bi-directional-links/双向链接示例页面|自定义文案]]
