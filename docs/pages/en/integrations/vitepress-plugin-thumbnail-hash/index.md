<script setup>
import packageJSON from '~/packages/vitepress-plugin-thumbnail-hash/package.json'
</script>

# Thumbnail hashing for images <Badge type="tip" :text="`v${packageJSON.version}`" />

Why thumbnail? During page rendering for massive large documentations, when no thumbnail, blurhash nor thumbhash images applied, browser will try to load the original image, this may cause a huge performance issue, and even cause the page layout shaking, blinking, and re-painting, which eventually result in bad user experience.

So we got the solution by integrating Thumbhash algorithm into VitePress sites:

::: info Feel free to interact with the Thumbhash previewer below, and see how it works!

It is ok to replace to your image, or try to edit the thumbhash base64.

:::

<ThumbhashPreview
  thumbhash-text="Select image to generate thumbhash"
  apply-thumbhash-text="Apply Thumbhash"
  click-to-upload-text="Click to upload image"
  copy-to-clipboard-text="Copy to clipboard"
  clear-input-thumbhash-text="Clear thumbhash"
  input-thumbhash-placeholder="Input Thumbhash base64..."
  preview-thumbhash-text="Input Thumbhash to preview"
  demo-image-url="/foxtail field.jpg"
/>

The generated thumbhash base64 will be like this:

```plaintext
HikOLYh4eXepiHecd/d3eoaAdwh4
```

if you have database or CMS connected to VitePress, you can store the thumbhash base64 into your database, and use it to render the image in your VitePress site. It's small enough to be stored in your database, and it's fast enough to be rendered in your VitePress site.

## Features

<div grid="~ cols-[auto_1fr] gap-1" items-start my-1>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Powered by unlazy</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Hashing for JPEG, PNG, WebP</span>
  <div h=[1rem]><div i-icon-park-outline:check-one text="green-600" /></div>
  <span>Smooth animation transition when image got loaded</span>
</div>

## Installation

It is easy and straightforward to install the thumbnail hashing plugin into your VitePress project, please follow the steps under [Getting started](./getting-started) page!

