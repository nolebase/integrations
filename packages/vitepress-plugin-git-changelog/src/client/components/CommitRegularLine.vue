<script setup lang="ts">
import { toDate } from 'date-fns'
import { defu } from 'defu'
import { inject } from 'vue'

import { useI18n } from '../composables/i18n'
import type { Commit } from '../../types'
import { renderCommitMessage } from '../utils'
import { InjectionKey, defaultNumCommitHashLetters, defaultOptions } from '../constants'

const props = defineProps<{
  commit: Commit
}>()

const options = defu(inject(InjectionKey, {}), defaultOptions)

const { t } = useI18n()
</script>

<template>
  <div class="i-octicon:git-commit-16 m-auto rotate-90 transform op-30" />
  <div flex gap-1>
    <a :href="props.commit.hash_url || `${props.commit.repo_url}/commit/${props.commit.hash}`" target="_blank">
      <code
        class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1"
        transition="color ease-in-out"
        duration-200
      >
        {{ commit.hash.slice(0, options.numCommitHashLetters || defaultNumCommitHashLetters) }}
      </code>
    </a>
    <span>-</span>
    <span>
      <span class="text-sm <sm:text-xs" v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
      <ClientOnly>
        <span class="text-xs op-50" :title="toDate(commit.date_timestamp).toString()">
          {{ t('committedOn', { props: { date: toDate(commit.date_timestamp).toLocaleDateString() }, omitEmpty: true }) || t('changelog.committedOn', { props: { date: toDate(commit.date_timestamp).toLocaleDateString() } }) }}
        </span>
      </ClientOnly>
    </span>
  </div>
</template>
