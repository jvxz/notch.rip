<template>
  <UCard class="relative flex h-full w-[1450px] shrink-0 items-center justify-center overflow-hidden">
    <Transition name="zoom">
      <Canvas />
    </Transition>

    <CenterPanelGrid />
  </UCard>
</template>
