<script lang="ts" setup>
const { triggerCanvasDownload } = useCanvas()
</script>

<template>
  <UCard class="size-full gap-7">
    <LeftPanelImageControls />
    <LeftPanelPresetSelect />
    <LeftPanelAspectControls />
    <LeftPanelColorControls />
    <LeftPanelCornerControls />
    <LeftPanelMenubarControls />
    <div class="flex-1" />
    <UButton @click="triggerCanvasDownload">
      Download
    </UButton>
  </UCard>
</template>
