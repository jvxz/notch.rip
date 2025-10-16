<template>
  <div class="flex h-screen p-2 gap-2">
    <div class="flex flex-1 flex-col gap-2">
      <UCard class="flex-row justify-between">
        <div class="flex items-center gap-2">
          <Logo /> <span class="text-2xl font-medium">notch.rip</span>
        </div>
        <UButton
          variant="ghost"
          size="icon"
          @click="toggleColorMode"
        >
          <Icon :name="$colorMode.preference === 'dark' ? 'tabler:sun' : 'tabler:moon'" />
        </UButton>
      </UCard>
      <LeftPanel />
    </div>

    <CenterPanel />

    <div class="flex-1">
      <RightPanel />
    </div>
  </div>
</template>
