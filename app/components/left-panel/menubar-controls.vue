<script lang="ts" setup>
const config = useConfigValues()
</script>

<template>
  <div class="flex flex-col gap-2">
    <LeftPanelHeading>
      <template #title>
        Menubar height
      </template>
    </LeftPanelHeading>
    <div class="flex items-center gap-2">
      <USlider
        :min="0"
        :max="0.1"
        :step="0.001"
        class="flex-1"
        :model-value="[config.menubarHeightScale.value]"
        @update:model-value="config.menubarHeightScale.value = $event?.[0] ?? 0"
      />
      <UNumberFieldRoot
        v-model:model-value="config.menubarHeightScale.value"
        :min="0"
        :max="0.1"
        :step="0.001"
        class="shrink-0"
      >
        <UNumberFieldContent>
          <UNumberFieldInput />
          <UNumberFieldIncrement />
          <UNumberFieldDecrement />
        </UNumberFieldContent>
      </UNumberFieldRoot>
    </div>
  </div>
</template>
