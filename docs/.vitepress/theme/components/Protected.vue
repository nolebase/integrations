<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LazyHydrationWrapper } from 'vue3-lazy-hydration'
import { decryptText, encryptText } from '../composables/crypto'

const password = ref('')
const iv = ref('')
const errored = ref(false)

const rawContent = '<div>a</div>'
const encryptedHtml = ref('')
const decryptedHtml = ref('')
const trigger = ref(false)

onMounted(async () => {
  try {
    const key = 'password'
    const encrypted = await encryptText(rawContent, key)
    encryptedHtml.value = encrypted.encryptedText
    iv.value = encrypted.ivBase64
  }
  catch (err) {
    console.error('Failed to encrypt the content.')
  }
})

async function onPasswordInput() {
  try {
    decryptedHtml.value = await decryptText(encryptedHtml.value, password.value, iv.value)
    trigger.value = true
  }
  catch (err) {
    console.error('Invalid password.')
    errored.value = true
    return
  }

  errored.value = false
}
</script>

<template>
  <div id="vp-nolebase-protected">
    <div>
      <div relative>
        <div flex="~ col" absolute left-0 top-0 z-10 h-full w-full items-center justify-center>
          <div mb-4>
            <p mt="0!" mb="4!" text-center>
              <span font-semibold>You don't have permissions to access this page.</span>
            </p>
            <p my="0!" text-left>
              <span>You could either</span>
              <ul my="0!">
                <li my="0!">
                  Request an access permission from the owner.
                </li>
                <li my="0!">
                  Prompt a valid password for it.
                </li>
              </ul>
            </p>
          </div>
          <div w-full flex="~ col" items-center justify-center max-w="80">
            <button
              min-w-35 w-full rounded-lg
              px-3 py-2
              bg="zinc-700 hover:zinc-600 active:zinc-700 dark:zinc-200 dark:hover:zinc-300 dark:active:zinc-400"
              text="zinc-100 dark:zinc-900 " font-semibold
              transition="all ease" duration-750
            >
              Request Access
            </button>
            <span>or</span>
            <form min-w-35 w-full flex="~ row" @submit.prevent="() => {}">
              <input
                v-model="password"
                type="password"
                mr-2
                w-full rounded-lg
                px-3 py-2
                bg="$vp-c-bg"
                text="$vp-c-text-1" font-semibold
                transition="all ease" duration-750
                :class="[
                  errored ? 'outline-offset-1 outline-2 outline-red-400' : 'outline-offset-1 outline-2 outline-zinc-100',
                ]"
                placeholder="Enter the valid password..."
              >
              <button
                rounded-lg
                px-3 py-2
                font-semibold
                transition="all ease" duration-750
                :class="[
                  password !== '' ? 'bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:active:bg-zinc-400 text-zinc-100 dark:text-zinc-900' : 'bg-$vp-c-bg cursor-not-allowed! text-$vp-c-text-1',
                ]"
                @click="onPasswordInput"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
        <div blur-md space-y-5>
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
          <div h="[1lh]" bg="[var(--vp-c-text-1)]" w-full rounded-lg opacity-5 />
        </div>
      </div>
      <LazyHydrationWrapper :when-triggered="trigger">
        <div id="vp-nolebase-protected-content">
          <slot />
        </div>
        <div v-html="decryptedHtml" />
      </LazyHydrationWrapper>
    </div>
  </div>
</template>
