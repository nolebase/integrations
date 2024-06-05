// Collect optional external dependencies required by the components to avoid accessing them directly in `.vue` files.
// Because users' vue-tsc may report errors due to missing optional dependencies when processing these `.vue` files in our repository.
//
// Ref: https://github.com/nolebase/integrations/pull/230

// @rive-app/canvas
export * as rive from '@rive-app/canvas'
export type { Rive } from '@rive-app/canvas'
