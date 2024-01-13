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

const options = inject(InjectionKey, {})

const { t } = useI18n()
const rawPath = useRawPath()
const commits = useCommits(Changelog.commits, rawPath)
const findRegisteredCreatorByName = (author_name: string) => options.mapContributors?.find(item => item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(author_name))
const findRegisteredCreatorByEmail = (author_email: string) => options.mapContributors?.find(item => item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(author_email))

const multipleAuthorsRegex = /^ *?Co-authored-by:(.*)(?:<|\(|\[|\{)(.*)(?:>|\)|\]|\}) *?$/mi
function handleMultipleAuthors(map: Record<string, ContributorInfo>, c: Commit) {
  let result: RegExpExecArray | null
  multipleAuthorsRegex.lastIndex = 0
  // eslint-disable-next-line no-cond-assign
  while (result = multipleAuthorsRegex.exec(c.message)) {
    const [, name, email] = result
    handleCommitAuthors(map, name.trim(), email.trim(), '')
  }
}

function handleCommitAuthors(map: Record<string, ContributorInfo>, authorName: string, authorEmail: string, authorAvatar: string) {
  const targetCreatorByName = findRegisteredCreatorByName(authorName)
  const targetCreatorByEmail = findRegisteredCreatorByEmail(authorEmail)

  let name = ''
  let avatar = ''
  let url: string | undefined

  if (targetCreatorByName) {
    name = targetCreatorByName.name || authorName
    avatar = targetCreatorByName.avatar || `https://gravatar.com/avatar/${authorAvatar}?d=retro`

    const foundGitHubLink = targetCreatorByName.links?.find(item => item.type === 'github')
    if (foundGitHubLink)
      url = foundGitHubLink.link
  }
  else if (targetCreatorByEmail) {
    name = targetCreatorByEmail.name || authorName
    avatar = targetCreatorByEmail.avatar || `https://gravatar.com/avatar/${authorAvatar}?d=retro`

    const foundGitHubLink = targetCreatorByEmail.links?.find(item => item.type === 'github')
    if (foundGitHubLink)
      url = foundGitHubLink.link
  }
  else {
    name = authorName
    avatar = `https://gravatar.com/avatar/${authorAvatar}?d=retro`
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
}

const contributors = computed<ContributorInfo[]>(() => {
  const map: Record<string, ContributorInfo> = {}
  commits.value.forEach((c) => {
    handleCommitAuthors(map, c.author_name, c.author_email, c.author_avatar)
    handleMultipleAuthors(map, c)
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
