<script setup lang="ts">
import type { DatetimeProperty, LocaleName } from '../types'

import { useData } from 'vitepress'

import { formatDistanceToNowFromValue } from '../utils'

const props = defineProps<{
  value: string | number | Date
  pageProperty?: DatetimeProperty<PropertyKey> | null
}>()

const { lang } = useData()
</script>

<template>
  <span :title="String(props.value)">
    {{ props.pageProperty?.formatAsFrom
      ? formatDistanceToNowFromValue(props.value, props.pageProperty?.dateFnsLocaleName || (lang as unknown as LocaleName) || 'enUS')
      : props.value
    }}
  </span>
</template>
