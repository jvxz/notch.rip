<script lang="ts" setup>
const { triggerCanvasDownload } = useCanvas()
</script>

<template>
  <UCard class="size-full flex-col gap-4">
    <h1 class="mb-2 text-2xl font-medium">
      Bar & corners
    </h1>
    <RightPanelPresetSelect />
    <RightPanelAspectControls />
    <RightPanelCornerControls />
    <div class="flex-1" />
    <UButton @click="triggerCanvasDownload">
      Download
    </UButton>
  </UCard>
</template>
