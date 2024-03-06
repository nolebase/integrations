<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { differenceInDays, toDate } from 'date-fns'
import { useData } from 'vitepress'

import Changelog from 'virtual:nolebase-git-changelog'

import { useRawPath } from '../composables/path'
import { useCommits } from '../composables/commits'
import { formatDistanceToNowFromValue, renderCommitMessage } from '../utils'
import { useI18n } from '../composables/i18n'
import { InjectionKey } from '../constants'
import type { Locale } from '../types'
import { defaultEnLocale, defaultLocales } from '../locales'

import VerticalTransition from './VerticalTransition.vue'

const toggleViewMore = ref(false)

const options = inject(InjectionKey, { locales: defaultLocales })

const { lang } = useData()
const { t } = useI18n()
const rawPath = useRawPath()
const commits = useCommits(Changelog.commits, rawPath)

const locale = computed<Locale>(() => {
  if (!options.locales || typeof options.locales === 'undefined')
    return defaultLocales[lang.value] || defaultEnLocale || {}

  return options.locales[lang.value] || defaultEnLocale || {}
})

const lastChangeDate = computed(() => {
  const dateTimestamp: number = commits.value[0]?.date_timestamp || 0
  if (!dateTimestamp)
    return new Date()

  return toDate(dateTimestamp)
})

const isFreshChange = computed(() => {
  if (!lastChangeDate.value)
    return false

  return differenceInDays(new Date(), lastChangeDate.value) < 1
})
</script>

<template>
  <em v-if="!commits.length" opacity="70">{{ t('noLogs') }}</em>
  <div
    v-else
    :class="[
      isFreshChange ? 'bg-green/16' : 'bg-$vp-custom-block-details-bg',
    ]"
    rounded-lg p-4
  >
    <label cursor-pointer>
      <div
        class="vp-nolebase-git-changelog-title flex select-none items-center justify-between"
        transition="color ease-in-out"
        text="<sm:xs" duration-200
      >
        <span class="vp-nolebase-git-changelog-last-edited-title inline-flex items-center gap-3">
          <span class="i-octicon:history-16" />
          <span v-if="commits[0]">
            {{ t('lastEdited', {
              props: {
                daysAgo: formatDistanceToNowFromValue(lastChangeDate, locale.lastEditedDateFnsLocaleName || lang || 'enUS'),
              },
            }) }}
          </span>
        </span>
        <input v-model="toggleViewMore" type="checkbox" invisible appearance-none>
        <span class="vp-nolebase-git-changelog-view-full-history-title inline-flex cursor-pointer items-center gap-3">
          <span class="<sm:hidden">
            {{ t('viewFullHistory') }}
          </span>
          <svg
            class="i-octicon:chevron-down-16"
            :class="[
              toggleViewMore ? 'rotate-180' : 'rotate-0',
            ]"
            transition="transform ease-in-out"
            duration-200
          />
        </span>
      </div>
    </label>
    <VerticalTransition :duration="200">
      <div
        v-show="toggleViewMore"
        class="grid grid-cols-[30px_auto] mt-3 gap-1.5 children:my-auto -ml-1.5"
        text="<sm:xs"
      >
        <template v-for="(commit) of commits" :key="commit.hash">
          <template v-if="commit.tag">
            <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
              <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
            </div>
            <div flex items-center gap-1>
              <a :href="commit.release_tag_url" target="_blank">
                <code class="font-bold">{{ commit.tag }}</code>
              </a>
              <span class="text-xs opacity-50">
                {{ t('committedOn', { props: { date: new Date(commit.date).toLocaleDateString() } }) }}
              </span>
            </div>
          </template>
          <template v-else>
            <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
            <div flex items-center gap-1>
              <a :href="`${commit.repo_url}/commit/${commit.hash}`" target="_blank">
                <code
                  class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1"
                  transition="color ease-in-out"
                  duration-200
                >
                  {{ commit.hash.slice(0, 5) }}
                </code>
              </a>
              <span>-</span>
              <span>
                <span class="text-sm <sm:text-xs" v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
                <span class="text-xs opacity-50">
                  {{ t('committedOn', { props: { date: new Date(commit.date).toLocaleDateString() } }) }}
                </span>
              </span>
            </div>
          </template>
        </template>
      </div>
    </VerticalTransition>
  </div>
</template>

<style scoped>
.vp-nolebase-git-changelog-title {
  color: var(--vp-custom-block-details-text);
  font-size: var(--vp-custom-block-font-size);
}

.vp-nolebase-git-changelog-title:hover {
  color: var(--vp-c-brand-1);
}

.vp-nolebase-git-changelog-last-edited-title {
  font-weight: 800;
}

.vp-nolebase-git-changelog-view-full-history-title {
  font-weight: 400;
}
</style>
