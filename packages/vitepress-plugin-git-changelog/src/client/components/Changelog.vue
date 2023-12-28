<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { computed, ref } from 'vue'

// @ts-expect-error virtual
import ChangelogData from 'virtual:nolebase-git-changelog'

import { useData } from 'vitepress'

import { useRawPath } from '../composables/path'
import { useCommits } from '../composables/commits'
import { renderCommitMessage } from '../utils'
import type { Changelog } from '../../types'
import { useI18n } from '../composables/i18n'
import VerticalTransition from './VerticalTransition.vue'

const changelogData = ChangelogData as Changelog

dayjs.extend(relativeTime)

const toggleViewMore = ref(false)

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
  <div
    v-else
    :class="[
      isFreshChange ? 'bg-green/16' : 'bg-$vp-custom-block-details-bg',
    ]"
    rounded-lg p-4
  >
    <label cursor-pointer>
      <div
        class="flex select-none items-center justify-between hover:text-$vp-c-brand-1"
        transition="color ease-in-out"
        text="<sm:xs" duration-200
      >
        <span class="inline-flex items-center gap-3 text-$vp-custom-block-details-text">
          <span class="i-octicon:history-16" />
          <span v-if="commits[0]">
            {{ t('lastEdited', { props: { daysAgo: lastChangeDate?.fromNow() } }) }}
          </span>
        </span>
        <input v-model="toggleViewMore" type="checkbox" invisible appearance-none>
        <span class="inline-flex items-center gap-3 !font-400">
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
    <VerticalTransition>
      <div
        v-show="toggleViewMore"
        class="grid grid-cols-[30px_auto] mt-2 gap-1.5 children:my-auto -ml-1.5"
        transition="height ease-in-out" duration-200
        text="<sm:xs"
      >
        <template v-for="(commit) of commits" :key="commit.hash">
          <template v-if="commit.tag">
            <div m="t-1" />
            <div class="m-auto h-7 w-7 inline-flex rounded-full bg-gray-400/10 text-sm opacity-90 <sm:text-xs">
              <div class="i-octicon:rocket-16" m="auto" />
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
                <span v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
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
