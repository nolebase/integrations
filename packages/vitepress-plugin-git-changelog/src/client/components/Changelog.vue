<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { computed } from 'vue'

// @ts-expect-error virtual
import ChangelogData from 'virtual:nolebase-git-changelog'

import { useData } from 'vitepress'
import { useRawPath } from '../composables/path'
import { useCommits } from '../composables/commits'

import { renderCommitMessage } from '../utils'
import type { Changelog } from '../../types'
import { useI18n } from '../composables/i18n'

const changelogData = ChangelogData as Changelog

dayjs.extend(relativeTime)

const rawPath = useRawPath()
const commits = useCommits(changelogData.commits, rawPath)
const { t } = useI18n()
const { lang } = useData()

const lastChangeDate = computed(() => {
  const date: string = commits.value[0]?.date || ''
  if (!date)
    return null
  return dayjs(date).locale(lang.value.toLocaleLowerCase())
})

const isFreshChange = computed(() => {
  if (!lastChangeDate.value)
    return false
  return lastChangeDate.value.isAfter(dayjs().locale(lang.value.toLocaleLowerCase()).subtract(1, 'day'))
})
</script>

<template>
  <em v-if="!commits.length" opacity="70">{{ t('noLogs') }}</em>
  <details v-else class="details custom-block [&_svg]:open:-rotate-180" :class="isFreshChange && '!bg-green/16'">
    <summary style="list-style: none" class="flex select-none items-center justify-between hover:text-$vp-c-brand-1">
      <span class="inline-flex items-center gap-3 text-$vp-custom-block-details-text">
        <span class="i-octicon:history-16" />
        <span v-if="commits[0]">
          {{ t('lastEdited', { props: { daysAgo: lastChangeDate?.fromNow() } }) }}
        </span>
      </span>
      <span class="inline-flex items-center gap-3 !font-400">
        <span>
          {{ t('viewMore') }}
        </span>
        <svg class="i-octicon:chevron-down-16" />
      </span>
    </summary>

    <div class="grid grid-cols-[30px_auto] my-2 gap-1.5 children:my-auto -ml-1.5">
      <template v-for="(commit) of commits" :key="commit.hash">
        <template v-if="commit.tag">
          <div m="t-1" />
          <div m="t-1" />
          <div class="m-auto h-7 w-7 inline-flex rounded-full bg-gray-400/10 text-sm opacity-90">
            <div class="i-octicon:rocket-16" m="auto" />
          </div>
          <div>
            <a :href="commit.release_tag_url" target="_blank">
              <code class="!text-primary font-bold">{{ commit.tag }}</code>
            </a>
            <span class="text-xs opacity-50"> {{ t('committedOn') }} {{ new Date(commit.date).toLocaleDateString() }}</span>
          </div>
        </template>
        <template v-else>
          <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
          <div>
            <a :href="`${commit.repo_url}/commit/${commit.hash}`" target="_blank">
              <code class="!hover:text-primary !text-xs !text-$vt-c-text-2">{{ commit.hash.slice(0, 5) }}</code>
            </a>
            <span text="sm">
              -
              <span v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
            </span>

            <span class="text-xs opacity-50">{{ t('committedOn', { props: { date: new Date(commit.date).toLocaleDateString() } }) }}</span>
          </div>
        </template>
      </template>
    </div>
  </details>
</template>
