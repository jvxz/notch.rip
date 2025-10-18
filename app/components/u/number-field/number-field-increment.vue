<script setup lang="ts">
import type { NumberFieldIncrementProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardProps } from 'reka-ui'

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldIncrement
    data-slot="increment"
    v-bind="forwarded"
    :class="cn(interactiveStyles.base, interactiveStyles.size.icon, interactiveStyles.variant.ghost, 'absolute top-1/2 right-1 grid size-6 -translate-y-1/2 place-items-center', props.class)"
  >
    <slot>
      <Icon name="tabler:plus" class="size-4" />
    </slot>
  </NumberFieldIncrement>
</template>
