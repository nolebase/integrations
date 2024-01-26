<script setup lang="ts">
import { formatRelative } from 'date-fns'
import * as DateFnsLocales from 'date-fns/locale'
import { useData } from 'vitepress'
import type { DatetimeProperty } from '../types'

const props = defineProps<{
  value: string | number | Date
  pageProperty?: DatetimeProperty<PropertyKey> | null
}>()

const { lang } = useData()

function formatRelativeFromValue(value: string | number | Date, localeName = lang.value) {
  try {
    return formatRelative(new Date(value), new Date(), {
      locale: DateFnsLocales[localeName],
    })
  }
  catch (err) {
    return value
  }
}
</script>

<template>
  <span>
    {{ props.pageProperty?.formatAsFrom ? formatRelativeFromValue(props.value, props.pageProperty?.dateFnsLocaleName) : props.value }}
  </span>
</template>
