<script lang="ts" setup>
const { imageFile } = useImageInput()

const { onChange: onFileChange, open: openFileDialog } = useFileDialog({
  accept: 'image/png, image/jpeg',
  multiple: false,
})

onFileChange((files) => {
  if (files && files[0]) {
    imageFile.value = files[0]
  }
})
</script>

<template>
  <UCard class="size-full">
    <div class="flex gap-2 *:flex-1">
      <UButton @click="openFileDialog">
        Import image
      </UButton>
      <UButton :disabled="!imageFile" @click="imageFile = null">
        Clear image
      </UButton>
    </div>
  </UCard>
</template>
