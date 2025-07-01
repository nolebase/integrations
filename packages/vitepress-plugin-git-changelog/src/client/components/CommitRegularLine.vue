<script setup lang="ts">
import type { CommitWithAuthorInfo } from '../composables/changelog'
import type { Locale } from '../types'

import { toDate } from 'date-fns'
import { defu } from 'defu'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'

import { useI18n } from '../composables/i18n'
import { defaultNumCommitHashLetters, defaultOptions, InjectionKey } from '../constants'
import { defaultEnLocale, defaultLocales } from '../locales'
import { formatDistanceToNowFromValue, renderCommitMessage } from '../utils'

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
  <div class="i-octicon:git-commit-16 m-auto rotate-90 transform op-30" />
  <div flex gap-1 align-baseline>
    <a :href="props.commit.hash_url || `${props.commit.repo_url}/commit/${props.commit.hash}`" target="_blank" class="no-icon">
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
      <span v-if="options.displayAuthorsInsideCommitLine" class="my-1 ml-3 gap-1">
        <template
          v-for="a of commit.authors"
          :key="a.name"
        >
          <a
            v-if="(typeof a.url !== 'undefined')"
            :href="a.url"
            class="no-icon"
          >
            <img :src="a.avatarUrl" :alt="`The avatar of contributor named as ${a.name}`" class="vp-nolebase-git-changelog-commit-avatar inline-block h-6 w-6 rounded-full v-middle">
          </a>
          <img v-else :src="a.avatarUrl" :alt="`The avatar of contributor named as ${a.name}`" class="vp-nolebase-git-changelog-commit-avatar inline-block h-6 w-6 rounded-full v-middle">
        </template>
      </span>
      <ClientOnly>
        <span class="text-xs op-50" :title="toDate(commit.date_timestamp).toString()">
          {{ formatCommittedOn(commit.date_timestamp) }}
        </span>
      </ClientOnly>
    </span>
  </div>
</template>

<style scoped>
.vp-nolebase-git-changelog-commit-avatar {
  border: 2px solid var(--vp-c-bg-soft);
  margin-left: -0.5em;
}
</style>
