<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { rgbaToThumbHash } from 'thumbhash'
import { createPngDataUri } from 'unlazy/thumbhash'
import { useClipboard } from '@vueuse/core'

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
  catch (err) {
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

function handleCopyHash() {
  const { copy } = useClipboard()
  copy(thumbhash.value)
}

function handleClearHash() {
  thumbhash.value = ''
}
</script>

<template>
  <div flex="~ col" relative>
    <button
      v-if="imageUploadObjectURL"
      bg="zinc-800/30 hover:zinc-800/80 active:zinc-800/50"
      flex="~"
      absolute right-4 top-4 h-10 w-10
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
      w-full cursor-pointer
      items-center justify-center
      overflow-hidden rounded-md duration-250
    >
      <input
        ref="imageUploadRef"
        type="file"
        invisible hidden w-full appearance-none
        @change="handleFileUpload"
      >
      <img v-if="imageUploadObjectURL" :src="imageUploadObjectURL">
      <div
        v-else
        flex="~ row"
        items-center
        px-4 py-10
      >
        <div i-icon-park-outline:add-picture text-2xl />
        <p font-semi-bold pl-3 text-lg>
          <span>Click to upload image</span>
        </p>
      </div>
    </label>
  </div>
  <div
    bg="zinc-100 dark:zinc-800"
    relative my-2 rounded-md px-4 py-2 font-mono
  >
    <span>
      {{ imageThumbhashBase64 || 'Select image to generate thumbhash' }}
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
  <div flex="~" my-4 w-full items-center justify-center>
    <button
      class="apply-btn"
      bg="zinc-100 dark:zinc-800 hover:zinc-200 active:zinc-100 dark:hover:zinc-700 dark:active:zinc-800"
      transition="all ease-in-out"
      flex="~ row"
      items-center justify-center rounded-full
      py-2 pl-2 pr-3
      duration-250
      @click="handleApplyHash"
    >
      <div
        class="apply-btn-icon-container"
        flex="~ row"
        h-7 w-7 items-center justify-center overflow-hidden rounded-full
        transition="all ease-in-out"
        duration-250
      >
        <div class="apply-btn-icon" i-icon-park-outline:double-down text-base />
      </div>
      <p m="0!" pb-0 pl-1 pt-0>
        <span text-sm>Apply Thumbhash</span>
      </p>
    </button>
  </div>
  <div
    :class="[
      thumbhashErrored ? 'bg-red-100 dark:bg-red-900' : 'bg-zinc-100 dark:bg-zinc-800',
    ]"
    relative my-2 rounded-md px-4 py-2 font-mono
  >
    <input v-model="thumbhash" placeholder="Input Thumbhash base64..." w-full text-base font-mono>
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
  <div flex="~ col" overflow-hidden rounded-md>
    <img v-if="thumbhash" :src="dataUri">
  </div>
</template>

<style>
.apply-btn::before {
  content: '';
  position: absolute;
  left: 0;
  width: calc(50% - 100px);
  display: inline-block;
  height: 2px;
  border-radius: 999.99px;
  background: #f4f4f5;
}

.dark .apply-btn::before {
  background: #3F3F46;
}

.apply-btn::after {
  content: '';
  position: absolute;
  right: 0;
  width: calc(50% - 100px);
  display: inline-block;
  height: 2px;
  border-radius: 999.99px;
  background: #f4f4f5;
}

.dark .apply-btn::after {
  background: #3F3F46;
}

.apply-btn:hover .apply-btn-icon-container {
  background: #d4d4d8;
}

.dark .apply-btn:hover .apply-btn-icon-container {
  background: #3F3F46;
}

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
    transform: translateY(35%);
    opacity: 0;
  }
  80% {
    transform: translateY(-35%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}
</style>
