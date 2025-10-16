const canvasDownloadEvent = createEventHook()

export const useCanvas = createSharedComposable(() => {
  const { width: windowWidth } = useWindowSize()
  const ssrWidth = useSSRWidth()

  const canvasSize = computed(() => {
    const width = ssrWidth ?? windowWidth.value

    if (width > 1536) {
      return { height: 1080 / 2, width: 1662.89 / 2 }
    }

    if (width < 1280) {
      return { height: 1080 / 3, width: 1662.89 / 3 }
    }

    return { height: 1080 / 4, width: 1662.89 / 4 }
  })

  return {
    canvasSize,
    onCanvasDownloadTrigger: canvasDownloadEvent.on,
    triggerCanvasDownload: canvasDownloadEvent.trigger,
  }
})
