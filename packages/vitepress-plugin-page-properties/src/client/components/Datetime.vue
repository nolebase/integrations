<script setup lang="ts">
import { useData } from 'vitepress'

import { formatDistanceToNowFromValue } from '../utils'
import type { DatetimeProperty } from '../types'

const props = defineProps<{
  value: string | number | Date
  pageProperty?: DatetimeProperty<PropertyKey> | null
}>()

const { lang } = useData()
</script>

<template>
  <span :title="String(props.value)">
    {{ props.pageProperty?.formatAsFrom
      ? formatDistanceToNowFromValue(props.value, props.pageProperty?.dateFnsLocaleName || lang.value)
      : props.value
    }}
  </span>
</template>
