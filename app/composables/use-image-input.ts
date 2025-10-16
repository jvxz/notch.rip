const imageInputStore = createGlobalState(() => ({
  image: ref<File | null>(null),
}))

export function useImageInput() {
  const { image } = imageInputStore()

  const { base64: imageBase64 } = useBase64(computed(() => image.value ? new Blob([image.value]) : undefined))

  return {
    imageBase64,
    imageFile: image,
  }
}
