<template>
  <div class="flex h-screen gap-2 p-2">
    <div class="flex flex-1 flex-col gap-2">
      <UCard class="flex-row justify-between">
        <div class="flex items-center gap-2">
          <Logo /> <span class="text-2xl font-medium">notch.rip</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            size="icon"
            class="cursor-default"
            as-child
          >
            <NuxtLink to="https://github.com/jvxz/notch.rip" target="_blank">
              <Icon name="tabler:brand-github" />
            </NuxtLink>
          </UButton>
          <UButton
            variant="ghost"
            size="icon"
            @click="toggleColorMode"
          >
            <Icon :name="$colorMode.value === 'dark' ? 'tabler:sun' : 'tabler:moon'" />
          </UButton>
        </div>
      </UCard>
      <LeftPanel />
    </div>
    <CenterPanel />
  </div>
</template>
