<script setup lang="ts">
import type { CommitWithAuthorInfo } from '../composables/changelog'
import type { Locale } from '../types'

import { toDate } from 'date-fns'
import { defu } from 'defu'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'

import { useI18n } from '../composables/i18n'
import { defaultOptions, InjectionKey } from '../constants'
import { defaultEnLocale, defaultLocales } from '../locales'
import { formatDistanceToNowFromValue } from '../utils'

const props = defineProps<{
  commit: CommitWithAuthorInfo
}>()

const options = defu(inject(InjectionKey, {}), defaultOptions)

const { t } = useI18n()
const { lang } = useData()

const locale = computed<Locale>(() => {
  if (!options.locales || typeof options.locales === 'undefined')
    return defaultLocales[lang.value] || defaultEnLocale || {}

  return options.locales[lang.value] || defaultEnLocale || {}
})

function formatCommittedOn(timestamp: number): string {
  const date = toDate(timestamp)
  let dateStr = date.toLocaleDateString()
  if (options.commitsRelativeTime) {
    dateStr = formatDistanceToNowFromValue(date, locale.value.changelog?.lastEditedDateFnsLocaleName || lang.value || 'enUS')
  }

  return t('committedOn', { props: { date: dateStr }, omitEmpty: true })
    || t('changelog.committedOn', { props: { date: dateStr } })
}
</script>

<template>
  <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
    <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
  </div>
  <div flex items-center gap-1>
    <a v-if="props.commit.tags && props.commit.tags.length === 1" :href="props.commit.release_tag_url" target="_blank" class="no-icon">
      <code class="font-bold">{{ props.commit.tag }}</code>
    </a>
    <span v-else>
      <a v-for="(tag, index) of props.commit.tags" :key="index" :href="props.commit.release_tags_url?.[index]" target="_blank">>
        <code class="font-bold">{{ tag }}</code>
      </a>
    </span>
    <ClientOnly>
      <span class="text-xs opacity-50" :title="toDate(props.commit.date_timestamp).toString()">
        {{ formatCommittedOn(props.commit.date_timestamp) }}
      </span>
    </ClientOnly>
  </div>
</template>
