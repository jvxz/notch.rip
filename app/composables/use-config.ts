export interface Config {
  aspect: {
    height: number
    width: number
  }
  corners: {
    bl: boolean
    br: boolean
    tl: boolean
    tr: boolean
  }
  menubarHeightScale: number
  notch: boolean
}
export type PresetKey = typeof PRESET_KEYS[number]
export const PRESET_KEYS = ['MacBook', 'Desktop'] as const
export const PRESETS: Record<PresetKey, Config> = {
  Desktop: {
    aspect: {
      height: 9,
      width: 16,
    },
    corners: {
      bl: true,
      br: true,
      tl: true,
      tr: true,
    },
    menubarHeightScale: 0.0165,
    notch: false,
  },
  MacBook: {
    aspect: {
      height: 1964,
      width: 3024,
    },
    corners: {
      bl: true,
      br: true,
      tl: true,
      tr: true,
    },
    menubarHeightScale: 0.039,
    notch: true,
  },
} as const

export const useConfigValues = createGlobalState(() => {
  const corners = ref({ ...PRESETS.MacBook.corners })
  const menubarHeightScale = ref(PRESETS.MacBook.menubarHeightScale)
  const notch = ref(PRESETS.MacBook.notch)
  const aspect = ref({ ...PRESETS.MacBook.aspect })
  const cornersColor = ref('#000000')
  const menubarColor = ref('#000000')
  const syncColors = ref(true)

  return {
    aspect,
    corners,
    cornersColor,
    menubarColor,
    menubarHeightScale,
    notch,
    syncColors,
  }
})

export const useConfig = createSharedComposable(() => {
  const config = useConfigValues()
  const currentPreset = ref<PresetKey | 'Custom'>('MacBook')

  let isApplyingPreset = false

  watch(reactive(config), () => {
    if (!isApplyingPreset && currentPreset.value !== 'Custom') {
      currentPreset.value = 'Custom'
    }
  }, { deep: true })

  async function applyPreset(preset: PresetKey) {
    isApplyingPreset = true

    config.aspect.value = { ...PRESETS[preset].aspect }
    config.corners.value = { ...PRESETS[preset].corners }
    config.menubarHeightScale.value = PRESETS[preset].menubarHeightScale
    config.notch.value = PRESETS[preset].notch

    currentPreset.value = preset
    await nextTick()
    isApplyingPreset = false
  }

  const canvasAspect = computed(() => config.aspect.value.width / config.aspect.value.height)

  return {
    applyPreset,
    canvasAspect,
    config,
    currentPreset,
  }
})
