---
title: Radio Group (Horizontal)
category: UI
---

<script setup>
import { ref } from 'vue'
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'

const value1 = ref(1)
const value2 = ref(1)
const value3 = ref(1)

const fieldOptions1 = [
  {
    value: 1,
    title: 'Option 1',
    helpMessage: 'Option 1 Help Message',
    ariaLabel: 'Option 1',
    icon: 'i-icon-park-outline:h1',
    name: 'Option 1',
  },
  {
    value: 2,
    title: 'Option 2',
    helpMessage: 'Option 2 Help Message',
    ariaLabel: 'Option 2',
    icon: 'i-icon-park-outline:h2',
    name: 'Option 2',
  },
  {
    value: 3,
    title: 'Option 3',
    helpMessage: 'Option 3 Help Message',
    ariaLabel: 'Option 3',
    icon: 'i-icon-park-outline:h3',
    name: 'Option 3',
  },
  {
    value: 4,
    title: 'Option 4',
    helpMessage: 'Option 4 Help Message',
    ariaLabel: 'Option 4',
    icon: 'i-icon-park-outline:level-four-title',
    name: 'Option 4',
  },
  {
    value: 5,
    title: 'Option 5',
    helpMessage: 'Option 5 Help Message',
    ariaLabel: 'Option 5',
    icon: 'i-icon-park-outline:level-five-title',
    name: 'Option 5',
  },
  {
    value: 6,
    title: 'Option 6',
    helpMessage: 'Option 6 Help Message',
    ariaLabel: 'Option 6',
    icon: 'i-icon-park-outline:level-six-title',
    name: 'Option 6',
  },
]

const fieldOptions2 = [
  {
    value: 1,
    title: 'Option 1',
    helpMessage: 'Option 1 Help Message',
    ariaLabel: 'Option 1',
    icon: 'i-icon-park-outline:freeze-column',
    text: 'Left',
    name: 'Option 1',
  },
  {
    value: 2,
    title: 'Option 2',
    helpMessage: 'Option 2 Help Message',
    ariaLabel: 'Option 2',
    icon: 'i-icon-park-outline:freeze-line',
    text: 'Center',
    name: 'Option 2',
  },
  {
    value: 3,
    title: 'Option 3',
    helpMessage: 'Option 3 Help Message',
    ariaLabel: 'Option 3',
    icon: 'i-icon-park-outline:freezing-line-column',
    text: 'Corner',
    name: 'Option 3',
  },
]

const fieldOptions3 = [
  {
    value: 1,
    title: 'Option 1',
    helpMessage: 'Option 1 Help Message',
    ariaLabel: 'Option 1',
    text: 'ON',
    name: 'Option 1',
  },
  {
    value: 2,
    title: 'Option 2',
    helpMessage: 'Option 2 Help Message',
    ariaLabel: 'Option 2',
    text: 'OFF',
    name: 'Option 2',
  },
]
</script>

# Radio Group (Horizontal) <Badge type="danger" text="Alpha" />

::: danger 🛑 This package is still in the Alpha test stage.
This package is still in the Alpha test stage and is not recommended for use in production. The API may change in the future, and there may be errors in the current version. Please use it with caution.
:::

## Examples

<NuInputHorizontalRadioGroup
  v-model="value1"
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions1"
/>

<br />

<NuInputHorizontalRadioGroup
  v-model="value2"
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions2"
/>

<br />

<NuInputHorizontalRadioGroup
  v-model="value3"
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions3"
/>

### Disabled

<br />

<NuInputHorizontalRadioGroup
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions1"
  :disabled="true"
/>

<br />

<NuInputHorizontalRadioGroup
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions2"
  :disabled="true"
/>

<br />

<NuInputHorizontalRadioGroup
  bg="zinc-200/50 dark:zinc-800/50"
  text="sm zinc-100"
  :options="fieldOptions3"
  :disabled="true"
/>
