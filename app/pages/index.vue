<template>
  <div class="flex h-screen">
    <div class="flex flex-1 flex-col gap-2 p-2">
      <UCard>
        <Logo />
      </UCard>
      <UCard class="size-full">
        Test
      </UCard>
    </div>

    <div class="flex h-full w-[1450px] shrink-0 items-center justify-center">
      <ClientOnly>
        <Canvas />
      </ClientOnly>
    </div>

    <div class="flex-1 p-2">
      <UCard class="size-full">
        Test
      </UCard>
    </div>
  </div>
</template>
