<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { LayoutMode } from '../types'
import MenuOption from './MenuOption.vue'
import MenuTitle from './MenuTitle.vue'

const mounted = useMounted()
const isMobile = useMediaQuery('(min-width: 768px)')
const layoutMode = useStorage('vp-nolebase-enhanced-readabilities-layout-switch-mode', LayoutMode.FitContentWidth)

function animate(element: HTMLElement) {
  element.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated')
  setTimeout(() => {
    element.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated')
  }, 600)
}

function setClasses(val: LayoutMode, animated: boolean) {
  switch (val) {
    case LayoutMode.FullWidth:
      animated && animate(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchOnlySidebarFullWidth')
      document.body.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      break
    case LayoutMode.OnlySidebarFullWidth:
      animated && animate(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchOnlySidebarFullWidth')
      break
    case LayoutMode.FitContentWidth:
      animated && animate(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchOnlySidebarFullWidth')
      break
  }
}

watch(mounted, (val) => {
  if (!val)
    return

  setClasses(layoutMode.value, false)
})

watch(layoutMode, (val) => {
  if (!mounted.value)
    return

  setClasses(val, true)
})

watch(isMobile, () => {
  if (isMobile.value) {
    layoutMode.value = LayoutMode.FitContentWidth
  }
})

onMounted(() => {
  if (isMobile.value) {
    layoutMode.value = LayoutMode.FitContentWidth
  }
})
</script>

<template>
  <div space-y-2>
    <MenuTitle icon="i-icon-park-outline:layout-one" title="布局切换" />
    <div flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full>
      <MenuOption v-model="layoutMode" :value="LayoutMode.FullWidth" :active="layoutMode === LayoutMode.FullWidth" icon="i-icon-park-outline:full-screen-one" title="全部最宽" />
      <MenuOption v-model="layoutMode" :value="LayoutMode.OnlySidebarFullWidth" :active="layoutMode === LayoutMode.OnlySidebarFullWidth" icon="i-icon-park-outline:off-screen" title="边栏最宽" />
      <MenuOption v-model="layoutMode" :value="LayoutMode.FitContentWidth" :active="layoutMode === LayoutMode.FitContentWidth" icon="i-icon-park-outline:off-screen-one" title="全部最窄" />
    </div>
  </div>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated {
  .VPNavBar.has-sidebar>.container>.title {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPNavBar.top>.container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPNavBar.has-sidebar>.container>.content {
    transition: padding-right 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPSidebar {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPContent.has-sidebar {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
  }

  .VPDoc .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc.has-aside .content-container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth {
  @media (min-width: 1440px) {
    .VPNavBar.has-sidebar>.container>.title {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar.top>.container {
      max-width: 100%;
    }

    .VPNavBar.has-sidebar>.container>.content {
      padding-right: calc((100vw - 100%) / 2 + 32px) !important;
      padding-left: calc((100vw - 100%) / 2 + var(--vp-sidebar-width)) !important;
    }

    .VPSidebar {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPContent.has-sidebar {
      padding-right: calc((100vw - 100%) / 2) !important;
      padding-left: calc((100vw - 100%) / 2 + var(--vp-sidebar-width)) !important;
    }
  }

  @media (min-width: 1440px) {
    .VPDoc.has-aside .content-container {
      max-width: 100%;
    }
  }

  @media (min-width: 1536px) {
    .VPDoc .container {
      max-width: 100%;
    }
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchOnlySidebarFullWidth {
  @media (min-width: 1440px) {
    .VPNavBar.has-sidebar>.container>.title {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar.top>.container {
      max-width: 100%;
    }

    .VPNavBar.has-sidebar>.container>.content {
      padding-right: calc((100vw - 100%) / 2 + 32px) !important;
      padding-left: calc((100vw - 100%) / 2 + var(--vp-sidebar-width)) !important;
    }

    .VPSidebar {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }
  }
}
</style>
