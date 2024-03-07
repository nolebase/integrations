<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function onClick() {
  count.value++
  // eslint-disable-next-line no-console
  console.log('Button clicked')
}
</script>

<template>
  <div>
    <button
      bg="blue" rounded="md" text="white" p="2" shadow="md" transition="all 0.3s ease"
      @click="onClick"
    >
      <span>
        Count is: {{ count }}
      </span>
      <div>
        <slot />
      </div>
    </button>
  </div>
</template>
