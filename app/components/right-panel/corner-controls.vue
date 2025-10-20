<script lang="ts" setup>
const config = useConfigValues()

function toggleCorner(corner: 'tl' | 'tr' | 'bl' | 'br') {
  config.corners.value[corner] = !config.corners.value[corner]
}

function toggleAllCorners() {
  if (Object.values(config.corners.value).some(Boolean)) {
    for (const corner of Object.keys(config.corners.value)) {
      config.corners.value[corner as keyof typeof config.corners.value] = false
    }
  }
  else {
    for (const corner of Object.keys(config.corners.value)) {
      config.corners.value[corner as keyof typeof config.corners.value] = true
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <p class="text-lg">
        Corners
      </p>
      <UButton
        size="sm"
        variant="soft"
        @click="toggleAllCorners"
      >
        Toggle
      </UButton>
    </div>
    <div class="relative mx-auto grid h-32 w-full max-w-56 place-items-center overflow-hidden rounded border">
      <Icon name="tabler:photo" class="!size-7 text-border" />
      <button
        :data-active="config.corners.value.tl"
        :class="cn(interactiveStyles.base, interactiveStyles.variant.soft, 'absolute size-6 rounded-none hover:bg-muted/50 active:bg-muted/50 data-[active=true]:bg-muted', 'inset-0 rounded-br border-t-0 border-r border-b border-l-0')"
        @click="toggleCorner('tl')"
      >
        <p class="sr-only">
          Top left corner
        </p>
      </button>
      <button
        :data-active="config.corners.value.tr"
        :class="cn(interactiveStyles.base, interactiveStyles.variant.soft, 'absolute size-6 rounded-none hover:bg-muted/50 active:bg-muted/50 data-[active=true]:bg-muted', 'inset-y-0 right-0 rounded-bl border-t-0 border-r-0 border-b border-l')"
        @click="toggleCorner('tr')"
      >
        <p class="sr-only">
          Top right corner
        </p>
      </button>
      <button
        :data-active="config.corners.value.bl"

        :class="cn(interactiveStyles.base, interactiveStyles.variant.soft, 'absolute size-6 rounded-none hover:bg-muted/50 active:bg-muted/50 data-[active=true]:bg-muted', 'bottom-0 left-0 rounded-tr border-t border-r border-b-0 border-l-0')"
        @click="toggleCorner('bl')"
      >
        <p class="sr-only">
          Bottom left corner
        </p>
      </button>

      <button
        :data-active="config.corners.value.br"
        :class="cn(interactiveStyles.base, interactiveStyles.variant.soft, 'absolute size-6 rounded-none hover:bg-muted/50 active:bg-muted/50 data-[active=true]:bg-muted', 'right-0 bottom-0 rounded-tl border-t border-r-0 border-b-0 border-l')"
        @click="toggleCorner('br')"
      >
        <p class="sr-only">
          Bottom right corner
        </p>
      </button>
    </div>
  </div>
</template>
