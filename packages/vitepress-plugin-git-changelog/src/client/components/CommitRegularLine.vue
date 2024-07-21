<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { toDate } from 'date-fns'
import { useData } from 'vitepress'
import { defu } from 'defu'

import { useI18n } from '../composables/i18n'
import type { Locale } from '../types'
import type { Commit } from '../../types'
import { formatDistanceToNowFromValue, renderCommitMessage } from '../utils'
import { defaultEnLocale, defaultLocales } from '../locales'
import { InjectionKey, defaultNumCommitHashLetters, defaultOptions } from '../constants'
import { type AuthorInfo, useChangelog } from '../composables/changelog'

const props = defineProps<{
  commit: Commit
}>()

const options = defu(inject(InjectionKey, {}), defaultOptions)

const { t } = useI18n()
const { lang, page } = useData()

const locale = computed<Locale>(() => {
  if (!options.locales || typeof options.locales === 'undefined')
    return defaultLocales[lang.value] || defaultEnLocale || {}

  return options.locales[lang.value] || defaultEnLocale || {}
})

const { getAuthorsForOneCommit } = useChangelog(page)
const authors = ref<AuthorInfo[]>([])
if (options.displayAuthorsInsideCommitLine)
  authors.value = getAuthorsForOneCommit(props.commit)

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
      <div v-if="options.displayAuthorsInsideCommitLine" class="my-1 ml-1 flex items-center gap-1">
        <template
          v-for="c of authors"
          :key="c.name"
        >
          <a
            v-if="(typeof c.url !== 'undefined')"
            :href="c.url"
          >
            <img :src="c.avatarUrl" :alt="`The avatar of contributor named as ${c.name}`" class="vp-nolebase-git-changelog-commit-avatar h-6 w-6 rounded-full">
          </a>
          <img v-else :src="c.avatarUrl" :alt="`The avatar of contributor named as ${c.name}`" class="vp-nolebase-git-changelog-commit-avatar h-6 w-6 rounded-full">
        </template>
        <ClientOnly>
          <span class="text-xs op-50" :title="toDate(commit.date_timestamp).toString()">
            {{ formatCommittedOn(commit.date_timestamp) }}
          </span>
        </ClientOnly>
      </div>
      <ClientOnly v-else>
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
  max-width: none;
}
.vp-nolebase-git-changelog-commit-avatar :first-child{
  margin-left: 0;
}
</style>
