<script lang="ts" setup>
const { triggerCanvasDownload } = useCanvas()
</script>

<template>
  <UCard class="size-full">
    <UButton @click="triggerCanvasDownload">
      Download
    </UButton>
  </UCard>
</template>
