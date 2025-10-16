<script lang="ts" setup>
const { imageFile } = useImageInput()
const dropZoneRef = useTemplateRef<HTMLDivElement>('dropZoneRef')

const { onChange: onFileChange, open: openFileDialog } = useFileDialog({
  accept: 'image/png, image/jpeg',
  multiple: false,
})

onFileChange((files) => {
  if (files && files[0]) {
    imageFile.value = files[0]
  }
})

const { isOverDropZone } = useDropZone(dropZoneRef, {
  multiple: false,
  onDrop: (files) => {
    if (files && files[0]) {
      imageFile.value = files[0]
    }
  },
  preventDefaultForUnhandled: true,
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <button
      ref="dropZoneRef"
      :data-dragover="isOverDropZone"
      class="flex h-32 flex-col items-center justify-center gap-2 rounded border border-dashed text-muted-foreground hover:border-muted-foreground/25 data-[dragover=true]:border-muted-foreground/25"
      @click="openFileDialog()"
    >
      <Icon name="tabler:photo" class="!size-8" />
      <p class="w-lg truncate">
        {{ imageFile?.name ?? "Drag or click to import" }}
      </p>
    </button>
    <div class="flex items-center gap-2">
      <UInput
        type="url"
        placeholder="Enter image URL"
        class="font-normal"
      />
      <UButton variant="soft" size="icon">
        <Icon name="tabler:arrow-right" class="!size-4" />
      </UButton>
      <UButton
        :disabled="!imageFile"
        variant="danger"
        @click="imageFile = null"
      >
        Clear image
      </UButton>
    </div>
  </div>
</template>
