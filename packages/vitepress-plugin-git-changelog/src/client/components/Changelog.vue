<script setup lang="ts">
import type { Locale } from '../types'

import { NuVerticalTransition } from '@nolebase/ui'
import { differenceInDays, toDate } from 'date-fns'
import { defu } from 'defu'
import { useData } from 'vitepress'
import { computed, inject, onMounted, ref, watch } from 'vue'

import CommitRegularLine from './CommitRegularLine.vue'
import CommitTagLine from './CommitTagLine.vue'

import { useChangelog } from '../composables/changelog'
import { useI18n } from '../composables/i18n'
import { defaultOptions, InjectionKey } from '../constants'
import { defaultEnLocale, defaultLocales } from '../locales'
import { formatDistanceToNowFromValue } from '../utils'

const options = defu(inject(InjectionKey, {}), defaultOptions)

const { t } = useI18n()
const { lang } = useData()
const { commits, useHmr } = useChangelog()

// The order of commits, defaults to true (descending order)
const isDescending = ref(true)
const toggleViewMore = ref(false)
const lastChangeDate = ref<Date>(commits.value[0]?.date_timestamp ? toDate(commits.value[0]?.date_timestamp) : new Date())

const locale = computed<Locale>(() => {
  if (!options.locales || typeof options.locales === 'undefined')
    return defaultLocales[lang.value] || defaultEnLocale || {}

  return options.locales[lang.value] || defaultEnLocale || {}
})

const isFreshChange = computed(() => {
  if (!lastChangeDate.value)
    return false

  return differenceInDays(new Date(), lastChangeDate.value) < 1
})

const reversedCommits = computed(() => {
  // reverse() will change the original array, so deep copy it
  // we can also use toReversed() in order to not change original array
  // but toReversed() has lack of compatibility
  const temp: typeof commits.value = [...commits.value]
  return temp.reverse()
})

onMounted(() => {
  lastChangeDate.value = commits.value[0]?.date_timestamp ? toDate(commits.value[0]?.date_timestamp) : new Date()
})

watch(commits, () => {
  lastChangeDate.value = commits.value[0]?.date_timestamp ? toDate(commits.value[0]?.date_timestamp) : new Date()
})

onMounted(() => {
  useHmr()
})
</script>

<template>
  <h2 v-if="!options.hideChangelogHeader" :id="t('changelog.titleId') || t('changelog.title')">
    {{ t('changelog.title') }}
    <a class="header-anchor" :href="`#${t('changelog.titleId') || t('changelog.title')}`" :aria-label="`Permalink to '${t('changelog.title')}'`" />
  </h2>
  <div v-if="!commits.length && !options.hideChangelogNoChangesText" :class="options.hideChangelogHeader && 'mt-6'" class="italic" opacity="70">
    {{ t('noLogs', { omitEmpty: true }) || t('changelog.noData') }}
  </div>
  <div
    v-else
    :class="[
      isFreshChange ? 'bg-green/16' : 'bg-$vp-custom-block-details-bg',
      options.hideChangelogHeader && 'mt-6',
    ]"
    class="vp-nolebase-git-changelog vp-nolebase-git-changelog-history vp-nolebase-git-changelog-history-list vp-nolebase-git-changelog-history-container"
    rounded-lg p-4
  >
    <label cursor-pointer @click="toggleViewMore = !toggleViewMore">
      <div
        class="vp-nolebase-git-changelog-title flex select-none items-center justify-between"
        transition="color ease-in-out"
        text="<sm:xs" duration-200
      >
        <span class="vp-nolebase-git-changelog-last-edited-title inline-flex items-center gap-3">
          <div class="i-octicon:history-16" />
          <span v-if="commits[0]">
            {{ t('lastEdited', {
              props: {
                daysAgo: formatDistanceToNowFromValue(lastChangeDate, locale.changelog?.lastEditedDateFnsLocaleName || lang || 'enUS'),
              },
              omitEmpty: true,
            }) || t('changelog.lastEdited', {
              props: {
                daysAgo: formatDistanceToNowFromValue(lastChangeDate, locale.changelog?.lastEditedDateFnsLocaleName || lang || 'enUS'),
              },
            }) }}
          </span>
        </span>
        <div
          v-if="!options.hideSortBy"
          :class="isDescending ? 'i-octicon:sort-desc-16' : 'i-octicon:sort-asc-16'" ml-auto mr-4 cursor-pointer
          @click.stop="toggleViewMore && (isDescending = !isDescending)"
        />
        <span class="vp-nolebase-git-changelog-view-full-history-title inline-flex cursor-pointer items-center gap-3">
          <span class="<sm:hidden">
            {{ t('viewFullHistory', { omitEmpty: true }) || t('changelog.viewFullHistory') }}
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
    <NuVerticalTransition :duration="200">
      <div
        v-show="toggleViewMore"
        class="grid grid-cols-[30px_auto] mt-3 gap-1.5 children:my-auto -ml-1.5"
        text="<sm:xs"
      >
        <template v-for="(commit) of (isDescending ? commits : reversedCommits)" :key="commit.hash">
          <template v-if="commit.tag && commit.tags && commit.release_tag_url && commit.release_tags_url">
            <CommitTagLine :commit="commit" />
          </template>
          <template v-else>
            <CommitRegularLine :commit="commit" />
          </template>
        </template>
      </div>
    </NuVerticalTransition>
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
