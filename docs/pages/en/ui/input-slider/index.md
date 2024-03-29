<script setup>
import { NuInputSlider } from '@nolebase/ui'
</script>

# Slider <Badge type="danger" text="Alpha" />

::: danger 🛑 This package is still in the Alpha test stage.
This package is still in the Alpha test stage and is not recommended for use in production. The API may change in the future, and there may be errors in the current version. Please use it with caution.
:::

## Example

<NuInputSlider
  name="Slider"
  :min="1"
  :max="10000"
  :step="1"
  :formatter="(val) => `${Math.ceil(val / 100)}%`"
/>
