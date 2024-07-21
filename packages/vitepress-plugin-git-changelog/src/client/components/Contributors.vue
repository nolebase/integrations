<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { useData } from 'vitepress'
import { defu } from 'defu'

import { useChangelog } from '../composables/commits'
import { useI18n } from '../composables/i18n'
import { InjectionKey, defaultOptions } from '../constants'

const options = defu(inject(InjectionKey, {}), defaultOptions)

const { t } = useI18n()
const { page } = useData()
const { authors, update } = useChangelog(page)

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

      if (data)
        update(data)
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

      if (newModule.default)
        update(newModule.default)
    })
  }
})
</script>

<template>
  <h2 v-if="!options.hideContributorsHeader" :id="t('contributors.titleId') || t('contributors.title')">
    {{ t('contributors.title') }}
    <a class="header-anchor" :class="options.hideContributorsHeader && 'mt-6'" :href="`#${t('contributors.titleId') || t('contributors.title')}`" :aria-label="`Permalink to '${t('contributors.title')}'`" />
  </h2>
  <div
    class="vp-nolebase-git-changelog vp-nolebase-git-changelog-contributors vp-nolebase-git-changelog-contributors-container vp-nolebase-git-changelog-contributors-list"
    flex flex-wrap gap-4 pt-2
  >
    <em
      v-if="!authors.length"
      :class="[
        options.hideContributorsHeader && 'mt-6',
      ]"
    >
      {{ t('noContributors', { omitEmpty: true }) || t('contributors.noData') }}
    </em>
    <template
      v-else
    >
      <template
        v-for="c of authors"
        :key="c.name"
      >
        <a
          v-if="(typeof c.url !== 'undefined')"
          :href="c.url"
          class="no-icon flex items-center gap-2"
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
