<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { useI18n } from '../composables/i18n'
import { LayoutMode } from '../types'
import MenuOption from './MenuOption.vue'
import MenuTitle from './MenuTitle.vue'
import MenuHelp from './MenuHelp.vue'

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const layoutMode = useStorage('vitepress-nolebase-enhanced-readabilities-layout-switch-mode', LayoutMode.FitContentWidth)
const { t } = useI18n()

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

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, switching to FitContentWidth layout mode.')
    layoutMode.value = LayoutMode.FitContentWidth
  }
})

onMounted(() => {
  if (!isLargerThanMobile.value) {
    console.warn('Mobile detected, switching to FitContentWidth layout mode.')
    layoutMode.value = LayoutMode.FitContentWidth
  }
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div flex items-center>
      <MenuTitle
        icon="i-icon-park-outline:layout-one"
        :title="t('layoutSwitch.title')"
        :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
        flex="1"
      />
      <MenuHelp>
        <h4 text-md font-semibold mb-1>
          {{ t('layoutSwitch.title') }}
        </h4>
        <p max-w-100 text="sm" mb-2>
          <span>{{ t('layoutSwitch.titleHelpMessage') }}</span>
        </p>
        <div space-y-2>
          <p max-w-100 text="sm" bg="zinc-700 dark:zinc-900" p-2 rounded-lg>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen-one mr-1 />
              <span>{{ t('layoutSwitch.optionFullWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionFullWidthHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="zinc-700 dark:zinc-900" p-2 rounded-lg>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:off-screen mr-1 />
              <span>{{ t('layoutSwitch.optionOnlySidebarFullWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionOnlySidebarFullWidthHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="zinc-700 dark:zinc-900" p-2 rounded-lg>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:off-screen-one mr-1 />
              <span>{{ t('layoutSwitch.optionFitContentWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionFitContentWidthHelpMessage') }}</span>
          </p>
        </div>
      </MenuHelp>
    </div>
    <fieldset flex="~ row" text="sm $vp-c-text-1" space-x-2 w-full appearance-none border-none>
      <MenuOption
        v-model="layoutMode"
        icon="i-icon-park-outline:full-screen-one"
        :title="t('layoutSwitch.optionFullWidth')"
        :aria-label="t('layoutSwitch.optionFullWidthAriaLabel')"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
        :value="LayoutMode.FullWidth"
      />
      <MenuOption
        v-model="layoutMode"
        icon="i-icon-park-outline:off-screen"
        :title="t('layoutSwitch.optionOnlySidebarFullWidth')"
        :aria-label="t('layoutSwitch.optionOnlySidebarFullWidthAriaLabel')"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
        :value="LayoutMode.OnlySidebarFullWidth"
      />
      <MenuOption
        v-model="layoutMode"
        icon="i-icon-park-outline:off-screen-one"
        :title="t('layoutSwitch.optionFitContentWidth')"
        :aria-label="t('layoutSwitch.optionFitContentWidthAriaLabel')"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
        :value="LayoutMode.FitContentWidth"
      />
    </fieldset>
  </div>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated {
  .VPNavBar.has-sidebar > .container > .title {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPNavBar > .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPNavBar.has-sidebar > .container > .content {
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

  .VPDoc:not(.has-sidebar) .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc:not(.has-sidebar) .container > .content {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth {
  @media (min-width: 1280px) {
    .VPNavBar.has-sidebar > .container > .title {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar > .container {
      max-width: 100%;
    }

    .VPNavBar.has-sidebar > .container > .content {
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

    .VPDoc.has-aside .content-container {
      max-width: 100%;
    }

    .VPDoc:not(.has-sidebar) .container {
      max-width: 100%;
    }

    .VPDoc:not(.has-sidebar) .container > .content {
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
  @media (min-width: 1280px) {
    .VPNavBar.has-sidebar > .container > .title {
      padding-left: max(32px, calc((100% - (100% - 64px)) / 2)) !important;
      width: calc((100% - (100% - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar > .container {
      max-width: 100%;
    }

    .VPNavBar.has-sidebar > .container > .content {
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
