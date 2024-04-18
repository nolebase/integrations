<script setup lang="ts">
import TagItem from './Item.vue'

const props = defineProps<{
  tag: { content: string }
  editing?: boolean
}>()

const emits = defineEmits<{
  (e: 'deleteTag', value: { content: string }): void
  (e: 'editTag', value: { content: string }): void
}>()

function deleteTag() {
  emits('deleteTag', props.tag)
}
</script>

<template>
  <TagItem>
    <template v-if="props.editing" #pre>
      <div
        class="tags-draggable-handle"
        h-5 w-5 rounded="md"
        hover="bg-zinc-300 dark:bg-zinc-800"
        active="opacity-0"
        transition="all duration-200 ease"
      >
        <div flex items-center opacity="50" class="i-octicon:grabber-16" />
      </div>
    </template>
    <template #default>
      <span>{{ props.tag.content }}</span>
    </template>
    <template v-if="props.editing" #post>
      <div flex items-center justify-center>
        <button
          mr-1 h-5 w-5 flex select-none items-center justify-center
          rounded="md"
          transition-all
          hover="bg-zinc-300 dark:bg-zinc-800"
          active="bg-zinc-400 dark:bg-zinc-900"
          transition="all duration-200 ease"
          @click="deleteTag"
        >
          <div flex items-center opacity="50" class="i-octicon:x-16" />
        </button>
      </div>
    </template>
  </TagItem>
</template>
