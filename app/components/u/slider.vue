<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SliderRoot
    :class="cn(
      'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full',
      props.class,
    )"
    v-bind="forwarded"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary data-[orientation=vertical]:w-2">
      <SliderRange class="absolute h-full bg-muted-foreground data-[orientation=vertical]:w-full" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      :class="cn(
        interactiveStyles.base,
        interactiveStyles.variant.soft,
        'block size-5 rounded-full active:bg-muted hover:bg-muted',
      )"
    />
  </SliderRoot>
</template>
