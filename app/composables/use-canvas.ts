const canvasDownloadEvent = createEventHook()

export const useCanvas = createSharedComposable(() => {
  const { width: windowWidth } = useWindowSize()
  const ssrWidth = useSSRWidth()
  const { config } = useConfig()

  const canvasSize = computed(() => {
    const width = ssrWidth ?? windowWidth.value

    if (width >= 2278) {
      const h = 1080 / 1.7
      return { height: h, width: h * config.resolution.value }
    }
    if (width >= 1690) {
      const h = 1080 / 2
      return { height: h, width: h * config.resolution.value }
    }
    else {
      const h = 1080 / 3
      return { height: h, width: h * config.resolution.value }
    }
  })

  return {
    canvasSize,
    onCanvasDownloadTrigger: canvasDownloadEvent.on,
    triggerCanvasDownload: canvasDownloadEvent.trigger,
  }
})
