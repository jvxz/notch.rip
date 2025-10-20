<script lang="ts" setup>
const config = useConfigValues()

const menubarColorPicker = useTemplateRef<HTMLInputElement>('menubarColorPicker')
const cornersColorPicker = useTemplateRef<HTMLInputElement>('cornersColorPicker')

const menubarColorInvalid = ref(false)
const cornersColorInvalid = ref(false)

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
    config.cornersColor.value = color
    config.menubarColor.value = color
    menubarColorInvalid.value = false
    cornersColorInvalid.value = false
    return
  }

  if (type === 'menubar') {
    config.menubarColor.value = color
  }
  else {
    config.cornersColor.value = color
  }
  menubarColorInvalid.value = false
  cornersColorInvalid.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-lg">
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
            :style="{ backgroundColor: config.cornersColor.value }"
            @click="cornersColorPicker?.click()"
          >
          </UButton>
          <input
            ref="cornersColorPicker"
            type="color"
            class="invisible absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full"
            @input="event => setColor((event.target as HTMLInputElement).value, 'corners')"
          />

          <UInput
            :model-value="config.cornersColor.value"
            class="ps-8 data-[invalid=true]:border-danger"
            :data-invalid="cornersColorInvalid"
            placeholder="#000000"
            @update:model-value="setColor($event.toString(), 'corners')"
          />
        </div>
      </div>
      <UToggle
        v-model:model-value="config.syncColors.value"
        size="icon"
        class="shrink-0 self-end"
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
            :style="{ backgroundColor: config.menubarColor.value }"
            @click="menubarColorPicker?.click()"
          >
          </UButton>
          <input
            ref="menubarColorPicker"
            type="color"
            class="invisible absolute inset-0 top-1/2 left-2 aspect-square size-4 -translate-y-1/2 rounded-full"
            @input="event => setColor((event.target as HTMLInputElement).value, 'menubar')"
          />

          <UInput
            :model-value="config.menubarColor.value"
            :data-invalid="menubarColorInvalid"
            class="ps-8 data-[invalid=true]:border-danger"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  </div>
</template>
