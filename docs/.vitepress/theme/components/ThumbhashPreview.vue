<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { rgbaToThumbHash } from 'thumbhash'
import { createPngDataUri } from 'unlazy/thumbhash'
import { computed, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  thumbhashText?: string
  applyThumbhashText?: string
  clickToUploadText?: string
  copyToClipboardText?: string
  clearInputThumbhashText?: string
  inputThumbhashPlaceholder?: string
  previewThumbhashText?: string
  demoImageUrl?: string
}>(), {
  thumbhashText: 'Select image to generate thumbhash',
  applyThumbhashText: 'Apply Thumbhash',
  clickToUploadText: 'Click to upload image',
  copyToClipboardText: 'Copy to clipboard',
  clearInputThumbhashText: 'Clear thumbhash',
  inputThumbhashPlaceholder: 'Input Thumbhash base64...',
  previewThumbhashText: 'Input Thumbhash to preview',
  demoImageUrl: '',
})

const thumbhash = ref('')
const thumbhashErrored = ref(false)
const imageUploadRef = ref<HTMLInputElement | null>(null)
const imageUploaded = ref<HTMLImageElement | null>(null)
const imageUploadObjectURL = ref('')

const binaryToBase64 = (binary: Uint8Array) => btoa(String.fromCharCode(...binary))

const dataUri = ref('')

watch(() => thumbhash.value, async (val) => {
  if (!val) {
    dataUri.value = ''
    thumbhashErrored.value = false
    return
  }

  try {
    dataUri.value = createPngDataUri(val)
    thumbhashErrored.value = false
  }
  catch {
    thumbhashErrored.value = true
    return ''
  }
})

const imageThumbhashBase64 = computed(() => {
  if (!imageUploaded.value)
    return ''

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context)
    return ''

  const scale = 100 / Math.max(imageUploaded.value.width, imageUploaded.value.height)
  canvas.width = Math.round(imageUploaded.value.width * scale)
  canvas.height = Math.round(imageUploaded.value.height * scale)
  context.drawImage(imageUploaded.value, 0, 0, canvas.width, canvas.height)

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  const thumbHashBinary = rgbaToThumbHash(pixels.width, pixels.height, pixels.data)

  return binaryToBase64(thumbHashBinary)
})

function handleFileUpload(e: Event) {
  if (!e)
    return

  const file = imageUploadRef.value?.files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onload = (e) => {
    const image = new Image()
    image.onload = () => {
      imageUploadObjectURL.value = URL.createObjectURL(file)
      imageUploaded.value = image
    }

    if (!e.target)
      return

    image.src = e.target.result as string
  }
  reader.readAsDataURL(file)
}

function handleRemoveImage() {
  if (imageUploadObjectURL.value)
    URL.revokeObjectURL(imageUploadObjectURL.value)

  imageUploadObjectURL.value = ''
  imageUploaded.value = null
}

function handleApplyHash() {
  thumbhash.value = imageThumbhashBase64.value
}

async function handleCopyHash() {
  const { copy } = useClipboard()
  await copy(imageThumbhashBase64.value)
}

function handleClearHash() {
  thumbhash.value = ''
}

onMounted(() => {
  if (props.demoImageUrl) {
    const image = new Image()
    image.onload = () => {
      imageUploadObjectURL.value = props.demoImageUrl
      imageUploaded.value = image
      handleApplyHash()
    }

    image.src = props.demoImageUrl
  }
})
</script>

<template>
  <div grid="~ cols-[1fr_40px_1fr] <sm:cols-[1fr]" w-full gap-1.5>
    <div flex="~ col 1" relative order="1 <sm:1">
      <button
        v-if="imageUploadObjectURL"
        bg="zinc-800/30 hover:zinc-800/80 active:zinc-800/50"
        flex="~"
        absolute right-4 top-4 h-8 w-8
        items-center justify-center rounded-md
        transition="all ease-in-out"
        duration-250
        text="white/50 hover:white"
        @click="handleRemoveImage"
      >
        <div i-icon-park-outline:delete-five text-xl />
      </button>
      <label
        bg="zinc-100 hover:zinc-200 active:zinc-100 dark:zinc-800 dark:hover:zinc-700 dark:active:zinc-800"
        text="zinc-500 hover:zinc-700 active:zinc-500 dark:zinc-400 dark:hover:zinc-300 dark:active:zinc-400"
        flex="~"
        transition="all ease-in-out"
        h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-md duration-250
      >
        <input
          ref="imageUploadRef"
          type="file"
          invisible hidden w-full appearance-none
          @change="handleFileUpload"
        >
        <img v-if="imageUploadObjectURL" :src="imageUploadObjectURL" h-full w-full object-cover>
        <div
          v-else
          flex="~ row"
          h-full w-full items-center justify-center min-h="80 <sm:40"
        >
          <div i-icon-park-outline:add-picture text-2xl />
          <p font-semi-bold pl-3 text-lg>
            <span>{{ props.clickToUploadText }}</span>
          </p>
        </div>
      </label>
    </div>
    <div order="2 <sm:3" />
    <div
      order="3 <sm:5"
      bg="zinc-100 dark:zinc-800"
      text="zinc-500 dark:zinc-400"
      flex="~"
      transition="all ease-in-out"
      h-full w-full items-center justify-center overflow-hidden rounded-md duration-250
    >
      <img v-if="thumbhash" :src="dataUri" h-full w-full object-cover>
      <div v-else flex="~ row" h-full w-full items-center justify-center min-h="80 <sm:40">
        <p font-semi-bold text-lg>
          <span>{{ props.previewThumbhashText }}</span>
        </p>
      </div>
    </div>
    <div
      order="4 <sm:2"
      bg="zinc-100 dark:zinc-800"
      relative my-2 rounded-md px-4 py-2 font-mono
    >
      <span>
        {{ imageThumbhashBase64 || props.thumbhashText }}
      </span>
      <button
        border="2 solid zinc-200 dark:zinc-700"
        flex="~"
        bg="zinc-100 active:zinc-200 dark:zinc-800 dark:active:zinc-700"
        text="zinc-500 dark:zinc-400"
        absolute right-0 top-0 mx-1 my-1 h-8 w-8 items-center justify-center rounded-lg text-sm
        transition="all ease-in-out" duration-250
        @click="handleCopyHash"
      >
        <div i-icon-park-outline:clipboard />
      </button>
    </div>
    <div flex="~" my="2 <sm:0" mb="<sm:4" items-center justify-center order="5 <sm:4">
      <button
        class="apply-btn"
        bg="zinc-100 dark:zinc-800 hover:zinc-200 active:zinc-100 dark:hover:zinc-700 dark:active:zinc-800"
        transition="all ease-in-out"
        flex="~ row"
        h-full w-full items-center justify-center rounded-md duration-250 py="<sm:3"
        @click="handleApplyHash"
      >
        <div
          class="apply-btn-icon-container rotate-270 <sm:rotate-0"
          flex="~ row"
          transition="all ease-in-out"
          h-full w-full items-center justify-center overflow-hidden rounded-full duration-250
        >
          <div class="apply-btn-icon" i-icon-park-outline:double-down text-base />
        </div>
      </button>
    </div>
    <div
      :class="[
        thumbhashErrored ? 'bg-red-100 dark:bg-red-900' : 'bg-zinc-100 dark:bg-zinc-800',
      ]"
      order="6 <sm:6"
      relative my-2 rounded-md px-4 py-2 font-mono
    >
      <input v-model="thumbhash" :placeholder="props.inputThumbhashPlaceholder" w-full text-base font-mono>
      <button
        border="2 solid zinc-200 dark:zinc-700"
        flex="~"
        bg="zinc-100 active:zinc-200 dark:zinc-800 dark:active:zinc-700"
        text="zinc-500 dark:zinc-400"
        absolute right-0 top-0 mx-1 my-1 h-8 w-8 items-center justify-center rounded-lg text-sm
        transition="all ease-in-out" duration-250
        @click="handleClearHash"
      >
        <div i-icon-park-outline:clear-format />
      </button>
    </div>
  </div>
</template>

<style>
.apply-btn:hover .apply-btn-icon {
  animation: topDown 2s ease-in-out;
}

@keyframes topDown {
  0% {
    transform: translateY(0%);
    opacity: 100%;
  }
  40% {
    transform: translateY(0%);
    opacity: 100%;
  }
  60% {
    transform: translateY(40%);
    opacity: 0;
  }
  80% {
    transform: translateY(-40%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}
</style>
