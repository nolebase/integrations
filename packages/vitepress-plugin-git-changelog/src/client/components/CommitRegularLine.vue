<script setup lang="ts">
import { computed, inject } from 'vue'
import { toDate } from 'date-fns'
import { useData } from 'vitepress'
import { defu } from 'defu'

import { useI18n } from '../composables/i18n'
import type { Commit, Locale } from '../types'
import { formatDistanceToNowFromValue, renderCommitMessage } from '../utils'
import { defaultEnLocale, defaultLocales } from '../locales'
import { InjectionKey, defaultNumCommitHashLetters, defaultOptions } from '../constants'

const props = defineProps<{
  commit: Commit
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
  <div class="i-octicon:git-commit-16 m-auto rotate-90 transform op-30" />
  <div flex gap-1>
    <a :href="props.commit.hash_url || `${props.commit.repo_url}/commit/${props.commit.hash}`" target="_blank">
      <code
        class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1"
        transition="color ease-in-out"
        duration-200
      >
        {{ commit.hash.slice(0, options.numCommitHashLetters || defaultNumCommitHashLetters) }}
      </code>
    </a>
    <span>-</span>
    <span>
      <span class="text-sm <sm:text-xs" v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
      <ClientOnly>
        <span class="text-xs op-50" :title="toDate(commit.date_timestamp).toString()">
          {{ formatCommittedOn(commit.date_timestamp) }}
        </span>
      </ClientOnly>
    </span>
  </div>
</template>
