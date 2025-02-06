<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  src: string
  /**
   * Width of player's terminal in columns.
   *
   * When not set it defaults to 80 (until asciicast gets loaded) and to terminal width
   * saved in the asciicast file (after it gets loaded).
   *
   * It's recommended to set it to the same value as in asciicast file to avoid player
   * resizing itself from 80x24 to actual dimensions of the recording when it gets loaded.
   *
   * https://docs.asciinema.org/manual/player/options/#cols
   *
   * @default 80
   */
  cols?: number
  /**
   * Height of player's terminal in rows (lines).
   *
   * When not set it defaults to 24 (until asciicast gets loaded) and to terminal
   * height saved in the asciicast file (after it gets loaded).
   *
   * Same recommendation as for cols applies here.
   *
   * https://docs.asciinema.org/manual/player/options/#rows
   *
   * @default 24
   */
  rows?: number
  /**
   * Set this option to true if the playback should start automatically.
   *
   * Defaults to false - no auto play.
   *
   * https://docs.asciinema.org/manual/player/options/#autoplay
   *
   * @default false
   */
  autoPlay?: boolean
  /**
   * Set this option to true if the recording should be preloaded on player's initialization.
   *
   * Check [Loading a recording](https://docs.asciinema.org/manual/player/loading/) for
   * available options of getting a recording into the player in the most suitable way.
   *
   * https://docs.asciinema.org/manual/player/options/#preload
   *
   * @default false - no preload.
   */
  preload?: boolean
  /**
   * Set this option to either true or a number if playback should be looped. When set to a
   * number (e.g. 3) then the recording will be re-played given number of times and
   * stopped after that.
   *
   * https://docs.asciinema.org/manual/player/options/#loop
   *
   * @default false - no looping.
   */
  loop?: boolean
  /**
   * Start the playback at a given time.
   *
   * @default 0
   * @example 123 // (number of seconds)
   * @example '2:03' // (mm:ss)
   * @example '1:02:03' // (hh:mm:ss)
   */
  startAt?: number
  /**
   * Playback speed. The value of 2 means 2x faster.
   *
   * https://docs.asciinema.org/manual/player/options/#speed
   *
   * @default 1 - normal speed.
   */
  speed?: number
  /**
   * Limit terminal inactivity to a given number of seconds.
   *
   * For example, when set to 2 any inactivity (pauses) longer than 2 seconds
   * will be "compressed" to 2 seconds.
   *
   * Defaults to:
   *
   * - `idle_time_limit` from asciicast header (saved when passing
   * `-i <sec>` to `asciinema rec`),
   * - no limit, when it was not specified at the time of recording.
   */
  idleTimeLimit?: number
  /**
   * Terminal color theme.
   *
   * See Terminal themes for a list of available built-in themes, and how to use a custom theme.
   *
   * If this options is not specified, the player uses the original (recorded) theme when available;
   * otherwise, it uses the asciinema theme.
   *
   * Capture of the original terminal theme is performed by
   * [asciinema CLI](https://docs.asciinema.org/manual/cli/) since version 3.0.
   * For existing recordings in asciicast [v2 format](https://docs.asciinema.org/manual/asciicast/v2/),
   * you can embed a theme manually by adding the [`theme` entry](https://docs.asciinema.org/manual/asciicast/v2/#theme)
   * to the header line of a recording file.
   *
   * https://docs.asciinema.org/manual/player/options/#theme
   */
  theme?: string
  /**
   * Poster (a preview frame) to display until the playback is started.
   *
   * The following poster specifications are supported:
   *
   * - `npt:1:23` - display recording "frame" at given time using NPT ("Normal Play Time") notation
   * - `data:text/plain,Poster text` - print given text
   *
   * The easiest way of specifying a poster is to use NPT format. For example, `npt:1:23` will preload the
   * recording and display terminal contents at 1 min 23 sec.
   *
   * ```js
   * AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
   *   poster: 'npt:1:23'
   * });
   * ```
   *
   * Alternatively, a poster value of data:text/plain,This will be printed as poster\n\rThis in second line
   * will display arbitrary text. All ANSI escape codes can be used to add color and move the cursor around
   * to produce good looking poster.
   *
   * Example of using custom text poster with control sequences (aka escape codes):
   *
   * ```js
   * AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
   *   poster: "data:text/plain,I'm regular \x1b[1;32mI'm bold green\x1b[3BI'm 3 lines down"
   * });
   * ```
   *
   * Defaults to blank terminal or, when startAt is specified, to screen contents at time
   * specified by startAt.
   *
   * https://docs.asciinema.org/manual/player/options/#poster
   *
   * @default blank terminal
   */
  poster?: string
  /**
   * Hide or show user controls, i.e. bottom control bar.
   * @example true // always show controls
   * @example false // never show controls
   * @example "auto" // show controls on mouse movement, hide on lack of mouse movement
   *
   * @default "auto"
   */
  controls?: boolean | 'auto'
  /**
   * Defines a list of timeline markers.
   *
   * Example of unlabeled markers:
   *
   * ```js
   * AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
   *   markers: [5.0, 25.0, 66.6, 176.5]  // time in seconds
   * });
   *
   * Example of labeled markers:
   *
   * ```js
   * AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
   *   markers: [
   *     [5.0,   "Installation"],  // time in seconds + label
   *     [25.0,  "Configuration"],
   *     [66.6,  "Usage"],
   *     [176.5, "Tips & Tricks"]
   *   ]
   * });
   *
   * Markers set with this option override all
   * [markers embedded in asciicast files](https://docs.asciinema.org/manual/asciicast/v2/#m-marker).
   * If this option is not set the player defaults to markers found in the recording file (if any).
   *
   * [Markers overview](https://docs.asciinema.org/manual/player/markers/) provides more information
   * on using markers.
   *
   * https://docs.asciinema.org/manual/player/options/#markers
   */
  markers?: any[]
  /**
   * If pauseOnMarkers is set to true, the playback automatically pauses on every marker encountered
   * and it can be resumed by either pressing the space bar key or clicking on the play button.
   * The resumed playback continues until the next marker is encountered.
   *
   * This option can be useful in e.g. live demos: you can add markers to a recording, then play it
   * back during presentation, and have the player stop wherever you want to explain terminal contents
   * in more detail.
   *
   * @default false
   */
  pauseOnMarkers?: boolean
  /**
   * Size of the terminal font.
   *
   * Possible values:
   *
   * - any valid CSS font-size value, e.g. "15px"
   * "small"
   * "medium"
   * "big"
   *
   * @default "medium"
   */
  terminalFontSize?: string | 'small' | 'medium' | 'big'
  /**
   * Terminal font-family override.
   *
   * Use any valid CSS font-family value, e.g "'JetBrains Mono',
   * Consolas, Menlo, 'Bitstream Vera Sans Mono', monospace".
   *
   * If you want to use [web fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts),
   * see the [Fonts](https://docs.asciinema.org/manual/player/fonts/) section for information on the best way
   * to load them to ensure the player initializes properly.
   */
  terminalFontFamily?: string
  /**
   * Terminal line height override.
   *
   * The value is relative to the font size (like em unit in CSS). For example a value of 1 makes the line
   * height equal to the font size, leaving no space between lines. A value of 2 makes it double the font
   * size, etc.
   *
   * @default 1.33333333
   */
  terminalLineHeight?: number
}>()

const playerRef = ref<HTMLDivElement>()
const asciinemaPlayer = ref<any>()

onMounted(async () => {
  if (!window)
    return
  if (!document)
    return
  if (!playerRef.value)
    return

  const { AsciinemaPlayer } = await import('./deps')
  asciinemaPlayer.value = AsciinemaPlayer.create(props.src, playerRef.value, {
    ...props,
    fit: false,
  })
})

onUnmounted(() => {
  if (!window)
    return
  if (!document)
    return
  if (asciinemaPlayer.value)
    asciinemaPlayer.value.dispose()
})
</script>

<template>
  <div ref="playerRef" />
</template>
