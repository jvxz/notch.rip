<script lang="ts" setup>
import Konva from 'konva'

const { canvasAspect, config } = useConfig()
const { width: windowWidth } = useWindowSize()
const stageRef = useTemplateRef<Konva.Stage>('stageRef')
const imageRef = useTemplateRef<Konva.Image>('imageRef')

// @ts-expect-error incorrect types
const stageNode = computed<Konva.Stage | undefined>(() => stageRef.value?.getNode())

const getNotchHeight = (stageHeight: number) => stageHeight * 0.03
const menubarHeight = computed(() => (stageNode.value?.height() ?? 0) * config.menubarHeightScale.value)
const { canvasSize } = useCanvas()

const cornerRef = useTemplateRef<Konva.Image>('cornerRef')
const cornerSize = 11

const { imageUrl } = useImageInput()
const selectedImage = ref<HTMLImageElement | null>(null)

watch(imageUrl, async () => {
  if (imageUrl.value) {
    await new Promise((resolve) => {
      Konva.Image.fromURL(imageUrl.value!, (image: Konva.Image) => {
        selectedImage.value = image.image() as HTMLImageElement ?? null
        resolve(true)
      })
    })
    setInitialSettings()
  }
  else {
    selectedImage.value = null
  }
})

const { onCanvasDownloadTrigger } = useCanvas()
onCanvasDownloadTrigger(saveImage)

const notchRectConfig = computed<Konva.RectConfig>(() => ({
  cornerRadius: [0, 0, 9, 9],
  fill: 'black',
  height: getNotchHeight(canvasSize.value.height),
  visible: Boolean(config.notch.value),
  width: 125,
  x: (canvasSize.value.width) / 2 - 62.5,
}))

const menuBarConfig = computed<Konva.RectConfig>(() => ({
  fill: config.menubarColor.value,
  // +1 to fix miniscule gap between menubar + image + corners
  height: menubarHeight.value + 1,
  width: canvasSize.value.width,
}))

watch([windowWidth, canvasAspect, canvasSize, menubarHeight], () => {
  if (!stageNode.value)
    return

  setInitialSettings()
})

const imageConfig = computed<Konva.ImageConfig>(() => ({
  dragBoundFunc,
  draggable: true,
  image: (selectedImage.value as CanvasImageSource) || undefined,
}))

function setInitialSettings() {
  if (!imageRef.value || !stageNode.value || !selectedImage.value)
    return { height: 0, width: 0 }

  stageNode.value.setSize(canvasSize.value)

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  let targetHeight = 0
  let targetWidth = 0

  const imageAspect = selectedImage.value.naturalWidth / selectedImage.value.naturalHeight
  const isLandscape = selectedImage.value.naturalWidth > selectedImage.value.naturalHeight

  const usableHeight = stageNode.value.height() - menubarHeight.value

  if (isLandscape) {
    targetHeight = usableHeight
    targetWidth = targetHeight * imageAspect
  }
  else {
    targetWidth = stageNode.value.width()
    targetHeight = targetWidth / imageAspect

    if (targetHeight < usableHeight) {
      targetHeight = usableHeight
      targetWidth = targetHeight * imageAspect
    }
  }

  if (targetWidth < stageNode.value.width()) {
    targetWidth = stageNode.value.width()
    targetHeight = targetWidth / imageAspect
  }

  image.position({ x: 0, y: menubarHeight.value })
  image.scale({ x: 1, y: 1 })
  image.setSize({ height: targetHeight, width: targetWidth })
}

// limit the image to the stage
function dragBoundFunc(pos: Konva.Vector2d) {
  if (!imageRef.value || !stageNode.value)
    return pos

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  let x = 0
  let y = 0

  if (stageNode.value.width() <= image.getWidth() * image.scaleX()) {
    x = Math.max(pos.x > 0
      ? 0
      : pos.x, stageNode.value.width() - image.getWidth() * image.scaleX())
  }
  else {
    x = Math.min(pos.x < 0
      ? 0
      : pos.x, stageNode.value.width() - image.getWidth() * image.scaleX())
  }

  if (stageNode.value.height() <= image.getHeight() * image.scaleY()) {
    y = Math.max(pos.y > menubarHeight.value
      ? menubarHeight.value
      : pos.y, stageNode.value.height() - image.getHeight() * image.scaleY())
  }
  else {
    y = Math.min(pos.y < menubarHeight.value
      ? menubarHeight.value
      : pos.y, stageNode.value.height() - image.getHeight() * image.scaleY())
  }

  return { x, y }
}

function handleWheel(e: any) {
  e.evt.preventDefault()

  if (!imageRef.value || !stageNode.value)
    return

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  const oldScale = image.scaleX()
  const pointer = stageNode.value.getRelativePointerPosition()

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
  const konvaImage: Konva.Image = imageRef.value?.getNode()
  const source = konvaImage.image() as HTMLImageElement | undefined
  if (!stageNode.value || !source)
    return

  const targetAspect = canvasAspect.value

  const nativeWidth = source.naturalWidth
  const nativeHeight = source.naturalHeight

  let cropWidth = 0
  let cropHeight = 0

  if (cropHeight > stageNode.value.height()) {
    cropHeight = stageNode.value.height()
    cropWidth = cropHeight * targetAspect
  }
  else {
    cropWidth = stageNode.value.width()
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

  const dataUrl = stageNode.value.toDataURL({
    pixelRatio,
    quality: 1,
  })
  downloadFile(dataUrl, `notch-rip-${Date.now()}.png`)
}

function handleMouseEnter() {
  document.body.style.cursor = 'move'
}

function handleMouseLeave() {
  document.body.style.cursor = 'default'
}

onMounted(async () => {
  await until(() => stageNode.value).toBeTruthy()

  const layer = stageNode.value!.getLayers()

  layer.forEach((layer) => {
    const ctx = layer.getContext()._context

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    layer.batchDraw()
  })
})
</script>

<template>
  <div class="relative z-10 overflow-hidden rounded-b-none bg-black shadow-lg">
    <v-stage
      ref="stageRef"
      :config="canvasSize"
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

        <!-- corners -->

        <!-- top left -->
        <v-shape
          ref="cornerRef"
          :config="{
            visible: config.corners.value.tl,
            rotation: 90,
            sceneFunc: createCornerShape,
            fill: config.cornersColor.value,
            x: cornerSize,
            y: stageNode?.height() ? stageNode.height() * config.menubarHeightScale.value : 0,
          }"
        />
        <!-- top right -->
        <v-shape
          ref="cornerRef"
          :config="{
            visible: config.corners.value.tr,
            rotation: 180,
            sceneFunc: createCornerShape,
            fill: config.cornersColor.value,
            x: stageNode?.width() ? stageNode.width() : 0,
            y: stageNode?.height() ? stageNode.height() * config.menubarHeightScale.value + cornerSize : 0,
          }"
        />
        <!-- bottom left -->
        <v-shape
          ref="cornerRef"
          :config="{
            visible: config.corners.value.bl,
            sceneFunc: createCornerShape,
            fill: config.cornersColor.value,
            y: stageNode?.height() ? stageNode.height() - cornerSize : 0,
            height: cornerSize,
            width: cornerSize,
          }"
        />
        <!-- bottom right -->
        <v-shape
          ref="cornerRef"
          :config="{
            visible: config.corners.value.br,
            sceneFunc: createCornerShape,
            fill: config.cornersColor.value,
            rotation: 270,
            y: stageNode?.height() ? stageNode.height() : 0,
            x: stageNode?.width() ? stageNode.width() - cornerSize : 0,
            height: cornerSize,
            width: cornerSize,
          }"
        />

        <v-rect :config="notchRectConfig" />
        <v-rect :config="menuBarConfig" />
      </v-layer>
    </v-stage>
  </div>
</template>
