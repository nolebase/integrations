<script setup lang="ts">
import { computed, inject } from 'vue'

import Changelog from 'virtual:nolebase-git-changelog'

import { useRawPath } from '../composables/path'
import { useCommits } from '../composables/commits'
import { useI18n } from '../composables/i18n'
import { InjectionKey } from '../constants'

interface ContributorInfo {
  name: string
  commitsCount: number
  avatarUrl?: string
  url?: string
}

const options = inject(InjectionKey)

const rawPath = useRawPath()
const { t } = useI18n()
const commits = useCommits(Changelog.commits, rawPath)

const contributors = computed<ContributorInfo[]>(() => {
  const map: Record<string, ContributorInfo> = {}
  commits.value.forEach((c) => {
    const targetCreatorByName = options?.mapContributors?.find(item => item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(c.author_name))
    const targetCreatorByEmail = options?.mapContributors?.find(item => item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(c.author_email))

    let name = ''
    let avatar = ''
    let url: string | undefined

    if (targetCreatorByName) {
      name = targetCreatorByName.name
      avatar = targetCreatorByName.avatar

      const foundGitHubLink = targetCreatorByName.links?.find(item => item.type === 'github')
      if (foundGitHubLink)
        url = foundGitHubLink.link
    }
    else if (targetCreatorByEmail) {
      name = targetCreatorByEmail.name
      avatar = targetCreatorByEmail.avatar

      const foundGitHubLink = targetCreatorByEmail.links?.find(item => item.type === 'github')
      if (foundGitHubLink)
        url = foundGitHubLink.link
    }
    else {
      name = c.author_name
      avatar = `https://gravatar.com/avatar/${c.author_avatar}?d=retro`
    }

    if (!map[name]) {
      map[name] = {
        name,
        commitsCount: 0,
        avatarUrl: avatar,
        url,
      }
    }

    map[name].commitsCount++
  })

  return Object.values(map).sort((a, b) => b.commitsCount - a.commitsCount)
})
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <em
      v-if="!contributors.length"
    >
      {{ t('noContributors') }}
    </em>
    <template
      v-else
    >
      <template
        v-for="c of contributors"
        :key="c.name"
      >
        <a
          v-if="typeof c.url !== 'undefined'"
          :href="c.url"
        >
          <div class="flex items-center gap-2">
            <img :src="c.avatarUrl" class="h-8 w-8 rounded-full">
            {{ c.name }}
          </div>
        </a>
        <div
          v-else
          class="flex items-center gap-2"
        >
          <img :src="c.avatarUrl" class="h-8 w-8 rounded-full">
          {{ c.name }}
        </div>
      </template>
    </template>
  </div>
</template>
