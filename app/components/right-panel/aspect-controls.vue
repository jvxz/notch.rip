<script lang="ts" setup>
const config = useConfigValues()

function getScreenAspect() {
  config.aspect.value.height = screen.height
  config.aspect.value.width = screen.width
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2">
      <p>Aspect ratio</p>
      <UButton
        size="sm"
        variant="soft"
        @click="getScreenAspect"
      >
        Get screen aspect
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UNumberFieldRoot v-model:model-value="config.aspect.value.width" class="flex-1">
        <UNumberFieldContent>
          <UNumberFieldInput />
          <UNumberFieldIncrement />
          <UNumberFieldDecrement />
        </UNumberFieldContent>
      </UNumberFieldRoot>
      <Icon name="tabler:slash" class="!size-4 text-muted-foreground" />
      <UNumberFieldRoot v-model:model-value="config.aspect.value.height" class="flex-1">
        <UNumberFieldContent>
          <UNumberFieldInput />
          <UNumberFieldIncrement />
          <UNumberFieldDecrement />
        </UNumberFieldContent>
      </UNumberFieldRoot>
    </div>
  </div>
</template>
