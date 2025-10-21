<template>
  <div class="flex items-center justify-between gap-4">
    <p class="shrink-0 text-lg">
      <slot name="title" />
    </p>
    <!-- <div class="h-px flex-1 border-t border-dashed" /> -->
    <slot name="action" />
  </div>
</template>
