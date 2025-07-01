<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

import ObsidianLogo from '../assets/obsidian-logo.svg'
import VitePressLogo from '../assets/vitepress-logo-large.webp'
import VPHeroImageLayer from './VPHeroImageLogoLayer.vue'

const layer1Ref = ref<HTMLDivElement>()
const layer2Ref = ref<HTMLDivElement>()
const layer3Ref = ref<HTMLDivElement>()
const layer4Ref = ref<HTMLDivElement>()

const isLessThanLg = useMediaQuery('(max-width: 1023px)')
const isLessThanMd = useMediaQuery('(max-width: 767px)')

const refs = [
  {
    ref: layer1Ref,
    mobile: {
      initial: { y: 15 },
      enter: { y: 15 },
      levitate: { y: 30 },
    },
    tablet: {
      initial: { y: 15 },
      enter: { y: 15 },
      levitate: { y: 40 },
    },
    desktop: {
      initial: { y: -75 },
      enter: { y: -75 },
      levitate: { y: -45 },
    },
  },
  {
    ref: layer2Ref,
    mobile: {
      initial: { y: 35 },
      enter: { y: 35 },
      levitate: { y: 55 },
    },
    tablet: {
      initial: { y: 45 },
      enter: { y: 45 },
      levitate: { y: 75 },
    },
    desktop: {
      initial: { y: -45 },
      enter: { y: -45 },
      levitate: { y: -5 },
    },
  },
  {
    ref: layer3Ref,
    mobile: {
      initial: { y: 60 },
      enter: { y: 60 },
      levitate: { y: 85 },
    },
    tablet: {
      initial: { y: 75 },
      enter: { y: 75 },
      levitate: { y: 110 },
    },
    desktop: {
      initial: { y: -10 },
      enter: { y: -10 },
      levitate: { y: 35 },
    },
  },
  {
    ref: layer4Ref,
    mobile: {
      initial: { y: 85 },
      enter: { y: 85 },
      levitate: { y: 110 },
    },
    tablet: {
      initial: { y: 110 },
      enter: { y: 110 },
      levitate: { y: 145 },
    },
    desktop: {
      initial: { y: 20 },
      enter: { y: 20 },
      levitate: { y: 75 },
    },
  },
]

refs.forEach((ref, index) => {
  const key = isLessThanMd.value ? 'mobile' : isLessThanLg.value ? 'tablet' : 'desktop'

  const { variant } = useMotion(ref.ref.value, {
    initial: {
      scale: 1,
      y: ref[key].initial.y,
      rotateX: '50deg',
      rotateZ: '-45deg',
    },
    enter: {
      y: ref[key].enter.y,
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 20,
        delay: index * 500,
        onComplete: () => {
          variant.value = 'levitate'
        },
      },
    },
    levitate: {
      y: ref[key].levitate.y,
      transition: {
        duration: 3000,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
        repeatType: 'mirror',
      },
    },
  })
})
</script>

<template>
  <div relative class="h-60 w-60 <lg:h-55 <lg:w-55 <md:h-50 <md:w-50 <sm:h-45 <sm:w-45" m-auto>
    <ClientOnly>
      <VPHeroImageLayer ref="layer1Ref" class="layer-1" z="4" shadow-md>
        <div
          left="8 <md:7 <sm:7"
          top="<md:7 <sm:6"
          absolute
          class="h-44 w-44 <lg:h-40 <lg:w-40 <md:h-36 <md:w-36 <sm:h-32 <sm:w-32"
          z="1"
        >
          <div i-fluent-emoji:notebook-with-decorative-cover h-full w-full />
        </div>
        <div h-full w-full opacity-60 blur-lg>
          <div i-fluent-emoji:notebook-with-decorative-cover h-full w-full />
        </div>
      </VPHeroImageLayer>
      <VPHeroImageLayer ref="layer2Ref" class="layer-2" z="3" shadow-md>
        <div h-full w-full>
          <div
            v-motion
            :initial="{ opacity: 0.3 }"
            :enter="{ opacity: 0.6, transition: { duration: 3000, repeat: Infinity, repeatType: 'mirror' } }"
            h-full w-full blur-lg
          >
            <div from="[#6fbef880]" to="[#ab45f680]" h-full w-full rounded-xl bg-gradient-to-r>
              <img :src="VitePressLogo">
            </div>
          </div>
        </div>
      </VPHeroImageLayer>
      <VPHeroImageLayer ref="layer3Ref" class="layer-3" z="2" shadow-md>
        <div h-full w-full>
          <div
            v-motion
            h
            :initial="{ opacity: 0.3 }"
            :enter="{ opacity: 0.6, transition: { duration: 3000, delay: 500, repeat: Infinity, repeatType: 'mirror' } }"
            h-full w-full rounded-xl opacity-80 blur-lg
          >
            <img :src="ObsidianLogo" h-full w-full>
          </div>
        </div>
      </VPHeroImageLayer>
      <VPHeroImageLayer ref="layer4Ref" class="layer-4" z="1" shadow-md>
        <div h-full w-full>
          <div
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 0.3, transition: { duration: 3000, delay: 2500, repeat: Infinity, repeatType: 'mirror' } }"
            h-full w-full blur-lg
          >
            <div i-octicon:markdown-24 h-full w-full text="dark:white" />
          </div>
        </div>
      </VPHeroImageLayer>
    </ClientOnly>
  </div>
</template>

<style>
.layer-1 {
  transform: rotateX(50deg) rotateZ(-45deg) translateZ(75px);
}
.layer-2 {
  transform: rotateX(50deg) rotateZ(-45deg) translateZ(25px);
}
.layer-3 {
  transform: rotateX(50deg) rotateZ(-45deg) translateZ(-25px);
}
.layer-4 {
  transform: rotateX(50deg) rotateZ(-45deg) translateZ(-75px);
}
</style>
