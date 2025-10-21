<script lang="ts" setup>
const { clearImage, imageFilename, imageUrl, isLoadingImage, setImage } = useImageInput()
const dropZoneRef = useTemplateRef<HTMLDivElement>('dropZoneRef')
const imageUrlInput = ref('')

const { onChange: onFileChange, open: openFileDialog, reset: resetFileDialog } = useFileDialog({
  accept: 'image/png, image/jpeg',
  multiple: false,
})

onPaste((data) => {
  if (data instanceof File && data.type.startsWith('image/')) {
    setImage(data)
  }
  else if (typeof data === 'string' && isUrl(data)) {
    imageUrlInput.value = data
    handleImageUrl()
  }
})

onFileChange((files) => {
  if (files && files[0]) {
    setImage(files[0])
  }
})

const { isOverDropZone } = useDropZone(dropZoneRef, {
  multiple: false,
  onDrop: (files) => {
    if (files && files[0]) {
      setImage(files[0])
    }
  },
  preventDefaultForUnhandled: true,
})

async function handleImageUrl() {
  if (!imageUrlInput.value)
    return

  if (!isUrl(imageUrlInput.value)) {
    return
  }

  setImage(imageUrlInput.value)
}
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
        {{ imageFilename ?? "Drag, click, or paste to import" }}
      </p>
    </button>
    <div class="flex items-center gap-2">
      <UInput
        v-model="imageUrlInput"
        type="url"
        placeholder="Enter image URL"
        class="font-normal"
        @keydown.enter="handleImageUrl"
      />
      <UButton
        :is-loading="isLoadingImage"
        variant="soft"
        size="icon"
        @click="handleImageUrl"
      >
        <Icon name="tabler:arrow-right" class="!size-4" />
      </UButton>
      <UButton
        :disabled="!imageUrl || isLoadingImage"
        variant="danger"
        @click="() => {
          clearImage()
          resetFileDialog()
        }"
      >
        Clear image
      </UButton>
    </div>
  </div>
</template>
