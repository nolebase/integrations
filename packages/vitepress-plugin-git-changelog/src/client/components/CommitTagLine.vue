<script setup lang="ts">
import { toDate } from 'date-fns'

import type { Commit } from '../../types'
import { useI18n } from '../composables/i18n'

const props = defineProps<{
  commit: Commit
}>()

const { t } = useI18n()
</script>

<template>
  <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
    <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
  </div>
  <div flex items-center gap-1>
    <a v-if="props.commit.tags && props.commit.tags.length === 1" :href="props.commit.release_tag_url" target="_blank">
      <code class="font-bold">{{ props.commit.tag }}</code>
    </a>
    <span v-else>
      <a v-for="(tag, index) of props.commit.tags" :key="index" :href="props.commit.release_tags_url?.[index]" target="_blank">>
        <code class="font-bold">{{ tag }}</code>
      </a>
    </span>
    <ClientOnly>
      <span class="text-xs opacity-50" :title="toDate(props.commit.date_timestamp).toString()">
        {{ t('committedOn', { props: { date: toDate(props.commit.date_timestamp).toLocaleDateString() }, omitEmpty: true }) || t('changelog.committedOn', { props: { date: toDate(props.commit.date_timestamp).toLocaleDateString() } }) }}
      </span>
    </ClientOnly>
  </div>
</template>
