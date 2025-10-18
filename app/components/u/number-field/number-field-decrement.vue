<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardProps } from 'reka-ui'

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldDecrement
    data-slot="decrement"
    v-bind="forwarded"
    :class="cn(interactiveStyles.base, interactiveStyles.size.icon, interactiveStyles.variant.ghost, 'absolute top-1/2 left-1 grid size-6 -translate-y-1/2 place-items-center', props.class)"
  >
    <slot>
      <Icon name="tabler:minus" class="size-4" />
    </slot>
  </NumberFieldDecrement>
</template>
