const imageHook = createEventHook<File | string | null>()

export const useImageInput = createSharedComposable(() => {
  const imageUrl = ref<string | null>(null)
  const imageFilename = ref<string | null>(null)

  const { execute, isLoading } = useAsyncState(async (image: File | string | null) => {
    // prevent re-running the same image
    if (image instanceof File && image.name === imageFilename.value) {
      return
    }

    if (image instanceof File) {
      imageUrl.value = URL.createObjectURL(image)
      imageFilename.value = image.name
    }

    if (typeof image === 'string') {
      const res = await $fetch.raw<Blob>('/api/image', {
        body: { url: image },
        method: 'POST',
        responseType: 'blob',
      })

      const { _data: blob } = res

      if (!blob) {
        return
      }

      imageUrl.value = URL.createObjectURL(blob)
      imageFilename.value = image
    }
  }, null, { immediate: false })
  imageHook.on(img => execute(0, img))

  function clearImage() {
    imageUrl.value = null
    imageFilename.value = null
  }

  return {
    clearImage,
    imageFilename,
    imageUrl,
    isLoadingImage: isLoading,
    setImage: imageHook.trigger,
  }
})
