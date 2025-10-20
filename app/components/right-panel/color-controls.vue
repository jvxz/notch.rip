<script lang="ts" setup>
const { config } = useConfig()

const localMenubarColor = refDefault(ref(), config.menubarColor.value)
const localCornersColor = refDefault(ref(), config.cornersColor.value)

const menubarColorPicker = useTemplateRef<HTMLInputElement>('menubarColorPicker')
const cornersColorPicker = useTemplateRef<HTMLInputElement>('cornersColorPicker')

const menubarColorInvalid = ref(false)
const cornersColorInvalid = ref(false)

const oneToSyncFrom = ref<'menubarColor' | 'cornersColor'>('menubarColor')
function setColor(color: string, type: 'menubar' | 'corners') {
  if (!isHex(color)) {
    if (type === 'menubar') {
      menubarColorInvalid.value = true
    }
    else {
      cornersColorInvalid.value = true
    }
    return
  }

  if (config.syncColors.value) {
    if (type === 'menubar') {
      config.cornersColor.value = color
      localCornersColor.value = color
    }
    else {
      config.menubarColor.value = color
      localMenubarColor.value = color
    }
    menubarColorInvalid.value = false
    cornersColorInvalid.value = false
    return
  }

  if (type === 'menubar') {
    localMenubarColor.value = color
    config.menubarColor.value = color
  }
  else {
    localCornersColor.value = color
    config.cornersColor.value = color
  }
  menubarColorInvalid.value = false
  cornersColorInvalid.value = false
}

watch(localMenubarColor, newMenubarColor => setColor(newMenubarColor, 'menubar'))
watch(localCornersColor, newCornersColor => setColor(newCornersColor, 'corners'))

function toggleSyncColors() {
  config.syncColors.value = !config.syncColors.value
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-xl font-medium">
      Color
    </p>
    <div class="flex items-center gap-2">
      <div class="flex flex-1 flex-col gap-1">
        <p class="text-sm">
          Corners
        </p>
        <div class="relative">
          <UButton
            variant="ghost"
            size="icon"
            class="absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full border"
            :style="{ backgroundColor: localCornersColor }"
            @click="() => {
              oneToSyncFrom = 'cornersColor'
              cornersColorPicker?.click()
            }"
          >
          </UButton>
          <input
            ref="cornersColorPicker"
            v-model="localCornersColor"
            type="color"
            class="invisible absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full"
          />

          <UInput
            v-model="localCornersColor"
            class="ps-8 data-[invalid=true]:border-danger"
            :data-invalid="cornersColorInvalid"
            placeholder="#000"
          />
        </div>
      </div>
      <UToggle
        size="icon"
        class="shrink-0 self-end"
        :model-value="config.syncColors.value"
        @update:model-value="toggleSyncColors"
      >
        <Icon name="tabler:link" />
      </UToggle>
      <div class="flex flex-1 flex-col gap-1">
        <p class="text-sm">
          Menubar
        </p>
        <div class="relative">
          <UButton
            variant="ghost"
            size="icon"
            class="absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full border"
            :style="{ backgroundColor: localMenubarColor }"
            @click="() => {
              oneToSyncFrom = 'menubarColor'
              menubarColorPicker?.click()
            }"
          >
          </UButton>
          <input
            ref="menubarColorPicker"
            v-model="localMenubarColor"
            type="color"
            class="invisible absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full"
          />

          <UInput
            v-model="localMenubarColor"
            :data-invalid="menubarColorInvalid"
            class="ps-8 data-[invalid=true]:border-danger"
            placeholder="#000"
          />
        </div>
      </div>
    </div>
  </div>
</template>
