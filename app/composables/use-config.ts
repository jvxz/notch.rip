export type PresetKey = keyof typeof PRESETS
export const PRESET_KEYS = ['MacBook', 'Desktop'] as const
export const PRESETS = {
  Desktop: {
    corners: {
      bl: true,
      br: true,
      tl: true,
      tr: true,
    },
    menubarHeightScale: 0.019,
    notch: false,
    resolution: 16 / 9,
  },
  MacBook: {
    corners: {
      bl: true,
      br: true,
      tl: true,
      tr: true,
    },
    menubarHeightScale: 0.039,
    notch: true,
    resolution: 3024 / 1964,
  },
} as const

export const useConfigValues = createGlobalState(() => {
  const corners = ref({
    bl: true,
    br: true,
    tl: true,
    tr: true,
  })
  const menubarHeightScale = ref(0.039)
  const notch = ref(true)
  const resolution = ref(3024 / 1964)

  return {
    corners,
    menubarHeightScale,
    notch,
    resolution,
  }
})

export const useConfig = createSharedComposable(() => {
  const config = useConfigValues()

  const currentPreset = ref<PresetKey | 'Custom'>('MacBook')

  function applyPreset(preset: PresetKey) {
    currentPreset.value = preset
    for (const key in PRESETS[preset]) {
      config[key as keyof typeof config].value = PRESETS[preset][key as keyof typeof PRESETS[typeof preset]]
    }
  }

  return {
    applyPreset,
    config,
    currentPreset,
  }
})
