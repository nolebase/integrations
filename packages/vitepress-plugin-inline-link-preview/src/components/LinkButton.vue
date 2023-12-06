<script setup lang="ts">
const props = defineProps<{
  showExternalIcon?: boolean
  href: string
}>()
</script>

<template>
  <a
    flex="~"
    :href="props.href"
    class="VPNolebaseInlinePreviewLinkPopupOpenBtn text-$vp-c-brand-1 active:brightness-95 hover:brightness-97"
    transition="all duration-200 ease"
    bg="$vp-c-bg"
    border="1 solid $vp-c-divider" shadow="sm"
    absolute bottom-0 m-4 items-center rounded-lg px-4 py-2 text-sm
  >
    <slot />
    <span
      v-if="props.showExternalIcon"
      class="i-icon-park-outline:full-screen-one VPNolebaseInlinePreviewLinkPopupOpenBtnIcon"
      inline-flex="~"
      ml-2 items-center justify-center text-xs
    />
  </a>
</template>

<style scoped less>
.VPNolebaseInlinePreviewLinkPopupOpenBtn {
  width: calc(100% - 32px);
}
</style>
