<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import * as DateFnsLocales from 'date-fns/locale'
import { useData } from 'vitepress'
import type { DatetimeProperty } from '../../types'

const props = defineProps<{
  value: string | number | Date
  pageProperty?: DatetimeProperty<PropertyKey> | null
}>()

const { lang } = useData()

function formatDistanceToNowFromValue(value: string | number | Date, localeName = lang.value) {
  try {
    return formatDistanceToNow(new Date(value), {
      locale: DateFnsLocales[localeName],
      addSuffix: true,
    })
  }
  catch (err) {
    return value
  }
}
</script>

<template>
  <span :title="String(props.value)">
    {{ props.pageProperty?.formatAsFrom
      ? formatDistanceToNowFromValue(props.value, props.pageProperty?.dateFnsLocaleName)
      : props.value
    }}
  </span>
</template>
