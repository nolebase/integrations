<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { differenceInDays, toDate } from 'date-fns'
import { useData } from 'vitepress'

import { NuVerticalTransition } from '@nolebase/ui'

import { useCommits } from '../composables/commits'
import { formatDistanceToNowFromValue } from '../utils'
import { useI18n } from '../composables/i18n'
import { InjectionKey } from '../constants'
import type { Locale } from '../types'
import { defaultEnLocale, defaultLocales } from '../locales'

import CommitRegularLine from './CommitRegularLine.vue'
import CommitTagLine from './CommitTagLine.vue'

const toggleViewMore = ref(false)

const options = inject(InjectionKey, { locales: defaultLocales })

const { lang, page } = useData()
const { t } = useI18n()
const { commits, update } = useCommits(page)

const lastChangeDate = ref<Date>(toDate(commits.value[0]?.date_timestamp))

onMounted(() => {
  if (import.meta.hot) {
    import.meta.hot.send('nolebase-git-changelog:client-mounted', {
      page: {
        filePath: page.value.filePath,
      },
    })

    // Plugin API | Vite
    // https://vitejs.dev/guide/api-plugin.html#handlehotupdate
    import.meta.hot.on('nolebase-git-changelog:updated', (data) => {
      if (!data || typeof data !== 'object')
        return

      if (data.commits)
        update(data.commits)
    })

    // HMR API | Vite
    // https://vitejs.dev/guide/api-hmr.html
    import.meta.hot.accept('virtual:nolebase-git-changelog', (newModule) => {
      if (!newModule)
        return
      if (!('default' in newModule))
        return
      if (!newModule.default || typeof newModule.default !== 'object')
        return

      if (newModule.default.commits)
        update(newModule.default.commits)
    })
  }
})

onMounted(() => {
  lastChangeDate.value = toDate(commits.value[0]?.date_timestamp)
})

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
</script>

<template>
  <h2 :id="t('changelog.title')">
    {{ t('changelog.title') }}
  </h2>
  <em v-if="!commits.length" opacity="70">{{ t('noLogs', { omitEmpty: true }) || t('changelog.noData') }}</em>
  <div
    v-else
    :class="[
      isFreshChange ? 'bg-green/16' : 'bg-$vp-custom-block-details-bg',
    ]"
    class="vp-nolebase-git-changelog vp-nolebase-git-changelog-history vp-nolebase-git-changelog-history-list vp-nolebase-git-changelog-history-container"
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
        <input v-model="toggleViewMore" type="checkbox" invisible appearance-none>
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
        <template v-for="(commit) of commits" :key="commit.hash">
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
