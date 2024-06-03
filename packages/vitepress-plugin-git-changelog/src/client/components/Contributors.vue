<script setup lang="ts">
import { inject, onMounted, onServerPrefetch, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { defu } from 'defu'

import { useCommits } from '../composables/commits'
import { useI18n } from '../composables/i18n'
import { InjectionKey, defaultOptions } from '../constants'
import type { Commit } from '../types'
import type { AuthorInfo } from '../composables/author'
import { extractAuthorsWithMultiple, mapCommitAuthors } from '../composables/author'

const options = defu(inject(InjectionKey, {}), defaultOptions)
const contributors = ref<AuthorInfo[]>([])

const { t } = useI18n()
const { page } = useData()
const { commits, update } = useCommits(page)

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

async function aggregateAuthors(commits: Commit[]) {
  const map: Record<string, AuthorInfo> = {}

  if (options.mapAuthors) {
    for (const c of commits) {
      await mapCommitAuthors(options.mapAuthors, map, c)
      await extractAuthorsWithMultiple(options.mapAuthors, map, c)
    }
  }
  else {
    for (const c of commits) {
      await mapCommitAuthors(options.mapContributors, map, c)
      await extractAuthorsWithMultiple(options.mapContributors, map, c)
    }
  }

  return Object.values(map).sort((a, b) => b.commitsCount - a.commitsCount)
}

onServerPrefetch(async () => {
  contributors.value = await aggregateAuthors(commits.value)
})

onMounted(async () => {
  contributors.value = await aggregateAuthors(commits.value)
})

watch(commits, async (newCommits) => {
  contributors.value = await aggregateAuthors(newCommits)
})
</script>

<template>
  <h2 :id="t('contributors.titleId')">
    {{ t('contributors.title') }}
    <a class="header-anchor" :href="`#${t('contributors.titleId')}`" :aria-label="`Permalink to '${t('contributors.title')}'`" />
  </h2>
  <div
    class="vp-nolebase-git-changelog vp-nolebase-git-changelog-contributors vp-nolebase-git-changelog-contributors-container vp-nolebase-git-changelog-contributors-list"
    flex flex-wrap gap-4 pt-2
  >
    <em
      v-if="!contributors.length"
    >
      {{ t('noContributors', { omitEmpty: true }) || t('contributors.noData') }}
    </em>
    <template
      v-else
    >
      <template
        v-for="c of contributors"
        :key="c.name"
      >
        <a
          v-if="(typeof c.url !== 'undefined')"
          :href="c.url"
          class="flex items-center gap-2"
        >
          <img :src="c.avatarUrl" :alt="`The avatar of contributor named as ${c.name}`" class="h-8 w-8 rounded-full">
          {{ c.name }}
        </a>
        <div
          v-else
          class="flex items-center gap-2"
        >
          <img :src="c.avatarUrl" :alt="`The avatar of contributor named as ${c.name}`" class="h-8 w-8 rounded-full">
          {{ c.name }}
        </div>
      </template>
    </template>
  </div>
</template>
