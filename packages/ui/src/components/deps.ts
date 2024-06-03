// Collect optional external dependencies required by the components to avoid accessing them directly in `.vue` files.
// Because users' vue-tsc may report errors due to missing optional dependencies when processing these `.vue` files in our repository.

// asciinema-player
export * as AsciinemaPlayer from 'asciinema-player'

// @rive-app/canvas
export * as rive from '@rive-app/canvas'
export type { Rive } from '@rive-app/canvas'
