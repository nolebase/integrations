<script setup lang="ts">
import { inject, onMounted, onServerPrefetch, ref, watch } from 'vue'
import { useData } from 'vitepress'

import type { Commit } from 'virtual:nolebase-git-changelog'

import { useCommits } from '../composables/commits'
import { useI18n } from '../composables/i18n'
import { InjectionKey } from '../constants'
import { digestStringAsSHA256 } from '../utils'

interface ContributorInfo {
  name: string
  commitsCount: number
  avatarUrl?: string
  url?: string
}

const options = inject(InjectionKey, {})
const contributors = ref<ContributorInfo[]>([])

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

async function aggregateContributors(commits: Commit[]) {
  const map: Record<string, ContributorInfo> = {}

  for (const c of commits) {
    await handleCommitAuthors(map, c.author_name, c.author_email, c.author_avatar)
    await handleMultipleAuthors(map, c)
  }

  return Object.values(map).sort((a, b) => b.commitsCount - a.commitsCount)
}

onServerPrefetch(async () => {
  contributors.value = await aggregateContributors(commits.value)
})

onMounted(async () => {
  contributors.value = await aggregateContributors(commits.value)
})

watch(commits, async (newCommits) => {
  contributors.value = await aggregateContributors(newCommits)
})

const findRegisteredCreatorByName = (author_name: string) => options.mapContributors?.find(item => item.nameAliases && Array.isArray(item.nameAliases) && item.nameAliases.includes(author_name))
const findRegisteredCreatorByEmail = (author_email: string) => options.mapContributors?.find(item => item.emailAliases && Array.isArray(item.emailAliases) && item.emailAliases.includes(author_email))

/**
 * This regular expression is used to match and parse commit messages that contain multiple author information.
 *
 * @see {@link https://regex101.com/r/q5YB8m/1 | Regexp demo}
 * @see {@link https://en.wikipedia.org/wiki/Email_address#Local-part | Email addres}
 * @see {@link https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors | Creating a commit with multiple authors in GitHub}
 */
const multipleAuthorsRegex = /^ *?Co-authored-by: ?(.*) ?(?:<)(.*)(?:>) *?/gmi

// This function handles multiple authors in a commit.
// It uses the regular expression to extract the name and email of each author from the commit message.
// About the docs: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
async function handleMultipleAuthors(map: Record<string, ContributorInfo>, c: Commit) {
  if (!c.body)
    return
  let result: RegExpExecArray | null
  multipleAuthorsRegex.lastIndex = 0
  // eslint-disable-next-line no-cond-assign
  while (result = multipleAuthorsRegex.exec(c.body)) {
    const [, name, email] = result
    handleCommitAuthors(map, name.trim(), email.trim(), await digestStringAsSHA256(email))
  }
}

async function handleCommitAuthors(map: Record<string, ContributorInfo>, authorName: string, authorEmail: string, authorAvatar?: string) {
  const targetCreatorByName = findRegisteredCreatorByName(authorName)
  const targetCreatorByEmail = findRegisteredCreatorByEmail(authorEmail)

  let name = ''
  let avatar = ''
  let url: string | undefined

  authorAvatar = authorAvatar
    ? `https://gravatar.com/avatar/${authorAvatar}?d=retro`
    : ''

  if (targetCreatorByName) {
    name = targetCreatorByName.name || authorName
    avatar = targetCreatorByName.avatar || authorAvatar

    const foundGitHubLink = targetCreatorByName.links?.find(item => item.type === 'github')
    if (foundGitHubLink)
      url = foundGitHubLink.link
  }
  else if (targetCreatorByEmail) {
    name = targetCreatorByEmail.name || authorName
    avatar = targetCreatorByEmail.avatar || authorAvatar

    const foundGitHubLink = targetCreatorByEmail.links?.find(item => item.type === 'github')
    if (foundGitHubLink)
      url = foundGitHubLink.link
  }
  else {
    name = authorName
    avatar = authorAvatar
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
