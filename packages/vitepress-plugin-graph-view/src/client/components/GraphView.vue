<script setup lang="ts">
import type {
  BaseType,
  D3DragEvent,
  D3ZoomEvent,
  Selection,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3'

import { useElementBounding, useMounted } from '@vueuse/core'
import {
  create,
  drag,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  scaleOrdinal,
  schemeAccent,
  zoom,
} from 'd3'
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

const divRef = ref<HTMLDivElement>()
const renderedNode = ref<SVGElement>()

const { isDark } = useData()
const { width, height } = useElementBounding(divRef)
const mounted = useMounted()

interface Node extends SimulationNodeDatum {
  id: number
  group: 'page' | 'tag'
}

const data: {
  nodes: Node[]
  links: SimulationLinkDatum<Node>[]
} = {
  nodes: [
    { id: 1, group: 'page' },
    { id: 2, group: 'tag' },
    { id: 3, group: 'tag' },
    { id: 4, group: 'page' },
    { id: 5, group: 'page' },
    { id: 6, group: 'tag' },
    { id: 7, group: 'tag' },
    { id: 8, group: 'page' },
  ],
  links: [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 4, target: 1 },
    { source: 5, target: 1 },
    { source: 6, target: 1 },
    { source: 1, target: 7 },
    { source: 2, target: 8 },
  ],
}

// The force simulation mutates links and nodes, so create a copy
// so that re-evaluating this cell produces the same result.
const links = data.links.map(d => ({ ...d }))
const nodes = data.nodes.map(d => ({ ...d }))

// Reheat the simulation when drag starts, and fix the subject position.
function dragStarted(simulation: Simulation<Node, undefined>): (event: D3DragEvent<Element, Node, Node>) => void {
  return (event) => {
    if (!event.active)
      simulation.alphaTarget(0.3).restart()

    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }
}

// Update the subject (dragged node) position during drag.
function dragged(_: Simulation<Node, undefined>): (event: D3DragEvent<Element, Node, Node>) => void {
  return (event) => {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragEnded(simulation: Simulation<Node, undefined>): (event: D3DragEvent<Element, Node, Node>) => void {
  return (event) => {
    if (!event.active)
      simulation.alphaTarget(0)

    event.subject.fx = null
    event.subject.fy = null
  }
}

function zoomed(
  node: Selection<BaseType | SVGCircleElement, Node, SVGGElement, undefined>,
  link: Selection<BaseType | SVGLineElement, SimulationLinkDatum<Node>, SVGGElement, undefined>,
): (event: D3ZoomEvent<SVGSVGElement, Node>) => void {
  return ({ transform }) => {
    link.attr('transform', (transform as any))
    node.attr('transform', (transform as any))
  }
}

async function render() {
  if (import.meta.env.SSR)
    return
  if (!window)
    return
  if (!document)
    return
  if (!divRef.value)
    return

  // Specify the color scale.
  // ! Since firefox does not support computedStyleMap yet
  // ! see https://developer.mozilla.org/en-US/docs/Web/API/Element/computedStyleMap#browser_compatibility
  // ! we need use getComputedStyle & getPropertyValue instead
  const vitepressBrandColor2 = getComputedStyle(document.body).getPropertyValue('--vp-c-brand-2')?.toString() || ''
  const color = scaleOrdinal([vitepressBrandColor2, ...schemeAccent])
  // Create a simulation with several forces.
  const simulation = forceSimulation(nodes)
    .force('link', forceLink(links).id(d => (d as Node).id))
    .force('charge', forceManyBody())
    .force('center', forceCenter(width.value / 2, height.value / 2))
    .force('x', forceX())
    .force('y', forceY())

  // Create the SVG container.
  const svg = create('svg')
    .attr('width', width.value)
    .attr('height', height.value)
    .attr('viewBox', [0, 0, width.value, height.value])
    .attr('style', 'max-width: 100%; height: auto;')

  // Add a line for each link, and a circle for each node.
  const link = svg.append('g')
    .attr('stroke', isDark.value ? '#555' : '#ddd')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 1)

  const node = svg.append('g')
    .attr('stroke', isDark.value ? '#111' : '#eee')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', d => color(d.group))

  node.append('title')
    .text(d => d.id)

  // Add a drag behavior.
  // @ts-expect-error drag generic typing too confusing
  node.call(drag<SVGCircleElement, Node>()
    .on('start', dragStarted(simulation))
    .on('drag', dragged(simulation))
    .on('end', dragEnded(simulation)))

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on('tick', () => {
    link
      .attr('x1', d => (d.source as any).x)
      .attr('y1', d => (d.source as any).y)
      .attr('x2', d => (d.target as any).x)
      .attr('y2', d => (d.target as any).y)
    node
      .attr('cx', d => (d as any).x)
      .attr('cy', d => (d as any).y)
  })

  const z = zoom<SVGSVGElement, Node>()
    .extent([[0, 0], [width.value, height.value]])
    .scaleExtent([0.5, 2])
    .on('zoom', zoomed(node, link))

  // @ts-expect-error zoom generic typing too confusing
  svg.call(z)

  renderedNode.value?.remove()
  renderedNode.value = svg.node()!
  divRef.value.appendChild(renderedNode.value)
}

watch(isDark, render, { immediate: true })
watch([width, height], render)
watch(mounted, render)
</script>

<template>
  <div relative>
    <div
      h="[224px]" mb-4 w-full cursor-move overflow-hidden rounded-md
      border="1 solid $vp-c-divider hover:zinc-400 dark:hover:zinc-600"
      bg="$vp-c-bg-alt hover:zinc-100 dark:hover:zinc-800"
      transition="all ease-in-out duration-250"
    >
      <ClientOnly>
        <div
          ref="divRef"
          transition="all ease-in-out duration-250"
          w-full
          :style="{ height: width ? `${width}px` : '100%' }"
        />
      </ClientOnly>
    </div>
    <div class="bar" flex items-center justify-center>
      <div
        bg="[#f6f3ef] dark:[#191717]"
        block w-full px-1 py-1 font-baloo-2
      >
        <span
          flex="~ row"
          leading="[16px]"
          text="xl center stone-700 dark:stone-300"
          mt="[2px]"
          min-h="[1rem]"
        >
          <span absolute translate-x="[224px]">
            CONSTRUCTING
          </span>
          <span absolute aria-hidden="true" translate-x="[224px]">
            CONSTRUCTING
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar {
  /**
    By default, each second, one bar, and a gap between them, will be scrolled.
   */
   --speed-factor: 1;

  --wb: 8;
  --h: 54;

  /**
    Wb = width of the bar
    W = 2 * H + Wb

    For example:
      Wb = 8px
      H = 64px

    This would give us:
      W = 2 * 64px + 8px = 136px

    However,
      If H = 32, Wb = 8, we need to shift -4px
      If H = 40, Wb = 8, we need to shift +2px
      If H = 54, Wb = 8, we need to shift -3px
    Why?
   */
  --w: calc(var(--h) * 2 + var(--wb) - 3);

  /**
    The width of the full bar, which includes the gap between the bars.
   */
  --wf: calc(var(--w) * 2);

  /**
    Since the speed is 2bar per second:
      V = 2 * Wb
    the duration of the animation should be:
      T = Wf / V * speed-factor

    Which is
      T = (2 * H + Wb) * 2 / Wb * speed-factor
   */
  --t: calc(var(--w) / var(--wb) * var(--speed-factor));

  position: absolute;
  width: 100%;
  height: calc(var(--h) * 1px);
  overflow: hidden;
  bottom: 40px;

  animation: scrolling linear infinite;
  animation-duration: calc(var(--t) * 1s);

  background-size: calc(var(--w) * 1px) calc(var(--h) * 1px);
  background-image: repeating-linear-gradient(
    45deg,
    #ffd66e,
    #ffd66e calc(var(--wb) * 1px),
    #ffe8b227 calc(var(--wb) * 1px),
    #ffe8b227 calc(var(--wb) * 1px * 2)
  );
}

.dark .bar {
  background-image: repeating-linear-gradient(
    45deg,
    #735823c9,
    #735823c9 calc(var(--wb) * 1px),
    #2b210c23 calc(var(--wb) * 1px),
    #2b210c23 calc(var(--wb) * 1px * 2)
  );
}

.bar div span span:nth-child(1) {
  animation: blinking calc(var(--speed-factor) * 2 * 1s) ease-in-out infinite, marquee-1-nth-child calc(var(--t) * 1s) linear infinite;
}

.bar div span span:nth-child(2) {
  animation: blinking calc(var(--speed-factor) * 2 * 1s) ease-in-out infinite, marquee-1-nth-child calc(var(--t) * 1s) calc((var(--t) / 2) * 1s) linear infinite;
}

@keyframes scrolling {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: calc(var(--w) * 1px * 2) 0;
  }
}

@keyframes blinking {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes marquee-1-nth-child {
  0% {
    transform: translateX(224px);
  }
  97% {
    visibility: visible;
    transform: translateX(calc(-100% - 4px));
  }
  98% {
    visibility: hidden;
    transform: translateX(calc(-100% - 4px));
  }
  99% {
    visibility: hidden;
    transform: translateX(224px);
  }
  100% {
    visibility: visible;
    transform: translateX(224px);
  }
}
</style>
