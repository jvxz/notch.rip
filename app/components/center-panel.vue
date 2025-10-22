<template>
  <UCard class="relative flex h-full w-full items-center justify-center overflow-hidden">
    <Transition name="zoom">
      <Canvas />
    </Transition>

    <CenterPanelGrid />
  </UCard>
</template>
