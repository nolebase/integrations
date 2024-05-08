<script setup lang="ts">
import { ref, watch } from 'vue'
import { useData } from 'vitepress'
import { useElementBounding, useMounted } from '@vueuse/core'
import type {
  BaseType,
  D3DragEvent,
  D3ZoomEvent,
  Selection,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3'
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
  if (!window)
    return
  if (!document)
    return
  if (!divRef.value)
    return

  // Specify the color scale.
  const color = scaleOrdinal([document.body.computedStyleMap().get('--vp-c-brand-2')!.toString(), ...schemeAccent])

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
      ref="divRef"
      border="1 solid $vp-c-divider hover:zinc-400 dark:hover:zinc-600"
      bg="$vp-c-bg-alt hover:zinc-100 dark:hover:zinc-800"
      transition="all ease-in-out duration-250"
      min-h="[224px]"
      :style="{ height: `${width}px` }"
      mb-4 w-full cursor-move overflow-hidden rounded-md
    />
    <div>
      <div class="bar" flex items-center justify-center>
        <div bg="[#f6f3ef] dark:[#191717]" text="yellow-900 dark:yellow-50/90" block w-fit px-2 py-1 text-center text-sm font-mono translate-y="[0.5px]" leading="[12px]">
          <span>CONSTRUCTING</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bar {
  position: absolute;
  width: 100%;
  height: 40px;
  overflow: hidden;
  bottom: 40px;
  animation: scrolling 20s linear infinite;
  background-size: 306.5px 40px;
  background-image: repeating-linear-gradient(
    45deg,
    #ffd66e,
    #ffd66e 6px,
    #ffefcb23 6px,
    #ffefcb23 12px
  );
}

.dark .bar {
  background-image: repeating-linear-gradient(
    45deg,
    #735823c9,
    #735823c9 6px,
    #2b210c23 6px,
    #2b210c23 12px
  );
}

@keyframes scrolling {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 320px 0;
  }
}
</style>
