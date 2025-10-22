<template>
  <div class="flex flex-col gap-2 p-2 lg:h-screen lg:flex-row">
    <div class="flex w-full flex-col gap-2 lg:w-[600px] xl:w-[800px]">
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
