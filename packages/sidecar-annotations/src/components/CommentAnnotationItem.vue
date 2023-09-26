<script setup lang="ts">
import { ref } from 'vue'
import FloatingUserAvatar from './FloatingUserAvatar.vue'

const props = defineProps<{
  element: HTMLElement
}>()

const commentUsers = ref<{
  id: number
  avatarUrl: string
}[]>([
  {
    id: 1,
    avatarUrl: 'https://source.unsplash.com/random',
  },
  {
    id: 1,
    avatarUrl: 'https://source.unsplash.com/random',
  },
  {
    id: 1,
    avatarUrl: 'https://source.unsplash.com/random',
  },
])

</script>

<template>
  <Teleport :to="props.element">
    <button
      class="sidecar-annotations-comments sidecar-annotations-comments-show-comment-btn"
      :style="{
        width: `${(commentUsers.length - 1) * 1 + 1.5}rem`,
      }"
      aria-hidden="true"
      focusable="false"
      absolute
      rounded-full flex
      h-5
    >
      <FloatingUserAvatar
        v-for="(user, index) of commentUsers"
        :key="index"
        :src="user.avatarUrl"
        :style="{
          order: `${index + 1}`,
          'margin-left': `${index === 0 ? 0 : -0.5}rem`,
        }"
      />
    </button>
    <!-- <button
      :style="boxStyles"
      aria-hidden="true"
      focusable="false"
      fixed z-50
      class="sidecar-annotations-controls"
      p-1.5
      rounded-full
      shadow="md hover:lg active:sm"
      bg="white"
      border="1 solid zinc-100"
      items-center justify-center
    >
      <div class="sidecar-annotations-control-comment i-tabler:message-circle-plus" w-5 h-5 />
    </button> -->
  </Teleport>
</template>

<style>
.VPDoc .container .content .content-container main .vp-doc > div > * {
  position: relative;
}

.VPDoc .container .content .content-container main .vp-doc div[class*='language-'], .vp-block {
  overflow-x: unset;
}

.VPDoc .container .content .content-container main .vp-doc > div .sidecar-annotations-comments-show-comment-btn {
  top: 0;
  left: -60px;
}

.VPDoc .container .content .content-container main .vp-doc > div > h2 .sidecar-annotations-comments-show-comment-btn {
  top: 24px;
}
</style>
