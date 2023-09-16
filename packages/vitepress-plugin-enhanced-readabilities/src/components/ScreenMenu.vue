<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import MenuTitle from './MenuTitle.vue'
import MenuOption from './MenuOption.vue'

const mounted = useMounted()
</script>

<template>
  <div space-y-2 v-if="mounted">
    <MenuTitle icon="i-icon-park-outline:book-open" title="阅读增强" />
    <div flex="~ col" pl-4 space-y-2>
      <div space-y-2>
        <MenuTitle icon="i-icon-park-outline:layout-one" title="布局切换" disabled />
        <div border="1 red/50 solid" bg="red/30" px-2 py-1 rounded-full flex items-center opacity-50>
          <span text-xs>移动端无可切换布局</span>
        </div>
        <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
          <MenuOption disabled icon="i-icon-park-outline:full-screen-one" title="全部最宽" />
          <MenuOption disabled icon="i-icon-park-outline:off-screen" title="边栏最宽" />
          <MenuOption disabled icon="i-icon-park-outline:off-screen-one" title="全部最窄" />
        </div>
      </div>
      <div space-y-2>
        <MenuTitle icon="i-icon-park-outline:click" title="行内高亮" disabled />
        <div border="1 red/50 solid" bg="red/30" px-2 py-1 rounded-full flex items-center opacity-50>
          <span text-xs>暂不支持触屏</span>
        </div>
        <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
          <MenuOption :value="true" title="开启" text="ON" disabled />
          <MenuOption :value="false" title="关闭" text="OFF" disabled />
        </div>
      </div>
    </div>
  </div>
</template>
