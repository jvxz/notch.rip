<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <NumberFieldInput
    data-slot="input"
    :class="cn(staticStyles.base, interactiveStyles.size.default, staticStyles.variant.default, 'flex w-full min-w-0 cursor-text truncate py-1 text-center font-medium selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:ring-0 md:text-sm', props.class)"
  />
</template>
