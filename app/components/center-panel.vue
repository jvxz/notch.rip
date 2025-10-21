<template>
  <UCard class="relative flex h-full w-3/4 shrink-0 items-center justify-center overflow-hidden">
    <Transition name="zoom">
      <Canvas />
    </Transition>

    <CenterPanelGrid />
  </UCard>
</template>
