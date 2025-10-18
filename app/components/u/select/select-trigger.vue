<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardProps } from 'reka-ui'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="cn(
      interactiveStyles.base,
      interactiveStyles.variant.outline,
      interactiveStyles.size.default,
      'flex w-fit items-center justify-between whitespace-nowrap data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
      props.class,
    )"
  >
    <slot />
    <SelectIcon as-child>
      <Icon name="tabler:chevron-down" class="!size-4 shrink-0 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
