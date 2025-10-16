<template>
  <div
    :class="cn(
      'absolute inset-0 bg-center',
      '[background-size:50px_50px]',
      '[background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]',
    )"
  />
  <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-card [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
</template>
