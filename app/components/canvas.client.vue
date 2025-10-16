<script lang="ts" setup>
import Konva from 'konva'
import { useImage } from 'vue-konva'

const { width: windowWidth } = useWindowSize()
const stageRef = useTemplateRef<Konva.Stage>('stageRef')
const imageRef = useTemplateRef<Konva.Image>('imageRef')
const [cornerImage] = useImage('/assets/corner.svg', 'Anonymous')

const getNotchHeight = (stageHeight: number) => stageHeight * 0.03
const getMenubarHeight = (stageHeight: number) => stageHeight * 0.039
const { canvasSize } = useCanvas()
const cornerSize = 10

const { imageBase64 } = useImageInput()
const selectedImage = ref<HTMLImageElement | null>(null)

watch(imageBase64, async () => {
  if (imageBase64.value) {
    await new Promise((resolve) => {
      Konva.Image.fromURL(imageBase64.value, (image: Konva.Image) => {
        selectedImage.value = image.image() as HTMLImageElement ?? null
        resolve(true)
      })
    })
    setInitialImageSettings()
  }
  else {
    selectedImage.value = null
  }
})

const { onCanvasDownloadTrigger } = useCanvas()
onCanvasDownloadTrigger(saveImage)

const stageConfig = computed<Konva.StageConfig>(() => ({
  ...canvasSize.value,
}))

const notchRectConfig = computed<Konva.RectConfig>(() => ({
  cornerRadius: [0, 0, 9, 9],
  fill: 'black',
  height: getNotchHeight(canvasSize.value.height),
  width: 125,
  x: (canvasSize.value.width) / 2 - 62.5,
}))

const menuBarConfig = computed<Konva.RectConfig>(() => ({
  fill: 'black',
  height: getMenubarHeight(canvasSize.value.height),
  width: canvasSize.value.width,
}))

watch(windowWidth, () => {
  if (!stageRef.value)
    return

  const { height, width } = canvasSize.value

  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value.getNode()

  stage.setSize({ height, width })
  setInitialImageSettings()
})

const imageConfig = computed<Konva.ImageConfig>(() => ({
  dragBoundFunc,
  draggable: true,
  image: (selectedImage.value as CanvasImageSource) || undefined,
}))

function setInitialImageSettings() {
  if (!imageRef.value || !stageRef.value || !selectedImage.value)
    return { height: 0, width: 0 }

  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value.getNode()

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  let targetHeight = 0
  let targetWidth = 0

  const imageAspect = selectedImage.value.naturalWidth / selectedImage.value.naturalHeight
  const isLandscape = selectedImage.value.naturalWidth > selectedImage.value.naturalHeight

  if (isLandscape) {
    targetHeight = stage.height()
    targetWidth = targetHeight * imageAspect
  }
  else {
    targetWidth = stage.width()
    targetHeight = targetWidth / imageAspect
  }

  if (targetWidth < stage.width()) {
    targetWidth = stage.width()
    targetHeight = targetWidth / imageAspect
  }

  image.position({ x: 0, y: 0 })
  image.scale({ x: 1, y: 1 })
  image.setSize({ height: targetHeight, width: targetWidth })
}

// limit the image to the stage
function dragBoundFunc(pos: Konva.Vector2d) {
  if (!imageRef.value || !stageRef.value)
    return pos

  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value.getNode()

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  let x = 0
  let y = 0

  if (stage.width() <= image.getWidth() * image.scaleX()) {
    x = Math.max(pos.x > 0 ? 0 : pos.x, stage.width() - image.getWidth() * image.scaleX())
  }
  else {
    x = Math.min(pos.x < 0 ? 0 : pos.x, stage.width() - image.getWidth() * image.scaleX())
  }

  if (stage.height() <= image.getHeight() * image.scaleY()) {
    y = Math.max(pos.y > 0 ? 0 : pos.y, stage.height() - image.getHeight() * image.scaleY())
  }
  else {
    y = Math.min(pos.y < 0 ? 0 : pos.y, stage.height() - image.getHeight() * image.scaleY())
  }

  return { x, y }
}

function handleWheel(e: any) {
  e.evt.preventDefault()

  if (!imageRef.value || !stageRef.value)
    return

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value.getNode()

  const oldScale = image.scaleX()
  const pointer = stage.getRelativePointerPosition()

  if (!pointer)
    return

  const mousePointTo = {
    x: (pointer.x - image.x()) / oldScale,
    y: (pointer.y - image.y()) / oldScale,
  }

  // zoom in or out?
  let direction = e.evt.deltaY > 0 ? -1 : 1

  // when zoom on trackpad e.evt.ctrlKey is true
  if (e.evt.ctrlKey) {
    direction = -direction
  }

  const scaleBy = 1.05

  const newScale = Math.max(1, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy)

  image.scale({ x: newScale, y: newScale })

  const newPos = dragBoundFunc({
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  })
  image.position(newPos)
}

async function saveImage() {
  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value?.getNode()

  // @ts-expect-error incorrect types
  const konvaImage: Konva.Image = imageRef.value?.getNode()
  const source = konvaImage.image() as HTMLImageElement | undefined
  if (!stage || !source)
    return

  const targetAspect = 3024 / 1964

  const nativeWidth = source.naturalWidth
  const nativeHeight = source.naturalHeight

  let cropWidth = 0
  let cropHeight = 0

  if (cropHeight > stage.height()) {
    cropHeight = stage.height()
    cropWidth = cropHeight * targetAspect
  }
  else {
    cropWidth = stage.width()
    cropHeight = cropWidth / targetAspect
  }

  let exportWidth = 0
  let exportHeight = 0

  if (exportHeight > nativeHeight) {
    exportHeight = nativeHeight
    exportWidth = exportHeight * targetAspect
  }
  else {
    exportWidth = nativeWidth
    exportHeight = exportWidth / targetAspect
  }

  const pixelRatio = exportWidth / cropWidth

  const dataUrl = stage.toDataURL({
    pixelRatio,
    quality: 1,
  })
  downloadFile(dataUrl, 'download.png')
}

function handleMouseEnter() {
  document.body.style.cursor = 'move'
}

function handleMouseLeave() {
  document.body.style.cursor = 'default'
}

onMounted(async () => {
  await until(() => stageRef.value).toBeTruthy()

  // @ts-expect-error incorrect types
  const stage: Konva.Stage = stageRef.value.getNode()
  const layer = stage.getLayers()

  layer.forEach((layer) => {
    const ctx = layer.getContext()._context

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    layer.batchDraw()
  })

  setInitialImageSettings()
})
</script>

<template>
  <div class="relative z-10 overflow-hidden rounded-[18px] rounded-b-none bg-black shadow-lg">
    <v-stage
      ref="stageRef"
      :config="stageConfig"
    >
      <v-layer :config="{ imageSmoothingEnabled: true }">
        <v-image
          v-if="selectedImage"
          ref="imageRef"
          :config="imageConfig"
          @wheel="handleWheel"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        />
        <v-rect :config="notchRectConfig" />
        <v-rect :config="menuBarConfig" />

        <!-- corners -->

        <!-- top left -->
        <v-image
          :config="{
            height: cornerSize,
            image: cornerImage ?? undefined,
            rotation: 90,
            width: cornerSize,
            x: cornerSize,
            y: getMenubarHeight(canvasSize.height) - 0.5,
          }"
        />
        <!-- top right -->
        <v-image
          :config="{
            height: cornerSize,
            image: cornerImage ?? undefined,
            rotation: 180,
            width: cornerSize,
            x: canvasSize.width,
            y: getMenubarHeight(canvasSize.height) + cornerSize - 0.5,
          }"
        />
        <!-- bottom left -->
        <v-image
          :config="{
            height: cornerSize,
            image: cornerImage ?? undefined,
            width: cornerSize,
            y: canvasSize.height - cornerSize,
          }"
        />
        <!-- bottom right -->
        <v-image
          :config="{
            rotation: 270,
            height: cornerSize,
            image: cornerImage ?? undefined,
            width: cornerSize,
            x: canvasSize.width - cornerSize,
            y: canvasSize.height ?? 0 - cornerSize,
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>
