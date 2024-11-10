---
title: Tag
category: UI
---

<script setup>
import { NuTag } from '@nolebase/ui'
</script>

# Tag <Badge type="danger" text="Alpha" />

::: danger 🛑 This package is in Alpha stage.
This package is still in the Alpha stage, and it is not recommended to use it in production. The API may change in the future, and there may be bugs in the current version. Please use it with caution.
:::

::: warning 🚧 Constructing
Nice to meet you! But sorry, this page is still under construction. If you don’t find the information you are interested in, you can first find the content you are interested in in the navigation in the sidebar to start reading.
:::

## Multiple states

### Normal state

<div class="my-2 flex gap-2">
  <NuTag :tag="{ content: 'Tag Content' }" />
  <NuTag :tag="{ content: 'Tag Content 1' }" />
  <NuTag :tag="{ content: 'Tag Content 2' }" />
  <NuTag :tag="{ content: 'Tag Content 3' }" />
</div>

### Editing state

<div class="my-2 flex gap-2">
  <NuTag :tag="{ content: 'Tag Content' }" :editing="true" />
  <NuTag :tag="{ content: 'Tag Content 1' }" :editing="true" />
  <NuTag :tag="{ content: 'Tag Content 2' }" :editing="true" />
  <NuTag :tag="{ content: 'Tag Content 3' }" :editing="true" />
</div>
