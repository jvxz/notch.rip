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
export const PRESET_KEYS = ['MacBook (MacOS 15≤)', 'MacBook (MacOS 26+)', 'Desktop (MacOS 15≤)', 'Desktop (MacOS 26+)'] as const
export const PRESETS: Record<PresetKey, Config> = {
  'Desktop (MacOS 15≤)': {
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
  'Desktop (MacOS 26+)': {
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
    menubarHeightScale: 0.02,
    notch: false,
  },
  'MacBook (MacOS 15≤)': {
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
  'MacBook (MacOS 26+)': {
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
    menubarHeightScale: 0.031,
    notch: true,
  },
} as const

export function useConfigValues() {
  const corners = useCookie('config:corners', {
    default: () => ({ ...PRESETS['MacBook (MacOS 26+)'].corners }),
  })
  const menubarHeightScale = useCookie('config:menubar-height-scale', {
    default: () => PRESETS['MacBook (MacOS 26+)'].menubarHeightScale,
  })
  const notch = useCookie('config:notch', {
    default: () => PRESETS['MacBook (MacOS 26+)'].notch,
  })
  const aspect = useCookie('config:aspect', {
    default: () => ({ ...PRESETS['MacBook (MacOS 26+)'].aspect }),
  })
  const cornersColor = useCookie('config:corners-color', {
    default: () => '#000000',
  })
  const menubarColor = useCookie('config:menubar-color', {
    default: () => '#000000',
  })
  const syncColors = useCookie('config:sync-colors', {
    default: () => true,
  })

  return {
    aspect,
    corners,
    cornersColor,
    menubarColor,
    menubarHeightScale,
    notch,
    syncColors,
  }
}

export const useConfig = createSharedComposable(() => {
  const config = useConfigValues()
  const currentPreset = ref<PresetKey | 'Custom'>('MacBook (MacOS 26+)')

  async function applyPreset(preset: PresetKey) {
    config.aspect.value.height = PRESETS[preset].aspect.height
    config.aspect.value.width = PRESETS[preset].aspect.width
    config.corners.value.bl = PRESETS[preset].corners.bl
    config.corners.value.br = PRESETS[preset].corners.br
    config.corners.value.tl = PRESETS[preset].corners.tl
    config.corners.value.tr = PRESETS[preset].corners.tr
    config.menubarHeightScale.value = PRESETS[preset].menubarHeightScale
    config.notch.value = PRESETS[preset].notch

    currentPreset.value = preset
    await nextTick()
  }

  const canvasAspect = computed(() => config.aspect.value.width / config.aspect.value.height)

  return {
    applyPreset,
    canvasAspect,
    config,
    currentPreset,
  }
})
