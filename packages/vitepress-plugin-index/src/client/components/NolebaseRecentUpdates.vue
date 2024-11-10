<script setup lang="ts">
import { useI18n } from '../composables/i18n'

const props = defineProps<{
  data: {
    title: string
    url: string
    lastUpdated: number
    category: string
    filePath: string
  }[]
}>()

const { t } = useI18n()
</script>

<template>
  <div v-for="item of props.data" :key="item.url" class="space-y-3">
    <a :href="item.url">
      <h3 m="0">
        {{ item.title }}
      </h3>
    </a>
    <div class="text-sm space-x-4">
      <div class="inline-block">
        <span class="i-octicon:repo-16 align-middle text-xs opacity-50" />
        <span class="align-middle opacity-50">{{ t('recentUpdates.category') }}</span>
        <span class="rounded-sm bg-[var(--vp-c-bg-mute)] px-6px py-3px align-middle opacity-70">{{ item.category }}</span>
      </div>
      <div class="inline-block opacity-50">
        <span class="i-octicon:history-16 align-middle text-xs" />
        <span class="align-middle">
          {{ t('recentUpdates.updatedAt') }}{{ new Date(item.lastUpdated || 0).toLocaleDateString() }}
        </span>
      </div>
    </div>
  </div>
</template>
