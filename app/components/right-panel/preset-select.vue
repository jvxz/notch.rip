<script lang="ts" setup>
const { applyPreset, currentPreset } = useConfig()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p>Presets</p>
    <USelectRoot :model-value="currentPreset" @update:model-value="(value) => applyPreset(value as PresetKey)">
      <USelectTrigger class="w-full text-muted-foreground">
        {{ currentPreset }}
      </USelectTrigger>
      <USelectContent>
        <USelectItem
          v-for="preset in PRESET_KEYS"
          :key="preset"
          :value="preset"
        >
          <USelectItemText>{{ preset }}</USelectItemText>
        </USelectItem>
      </USelectContent>
    </USelectRoot>
  </div>
</template>
