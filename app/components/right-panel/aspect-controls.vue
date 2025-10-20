<script lang="ts" setup>
const config = useConfigValues()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p>Aspect ratio</p>
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
