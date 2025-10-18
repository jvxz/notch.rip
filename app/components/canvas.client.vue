<script lang="ts" setup>
import Konva from 'konva'
import { useImage } from 'vue-konva'

const { config } = useConfig()
const { width: windowWidth } = useWindowSize()
const stageRef = useTemplateRef<Konva.Stage>('stageRef')
const imageRef = useTemplateRef<Konva.Image>('imageRef')
const [cornerImage] = useImage('/assets/corner.svg', 'Anonymous')

// @ts-expect-error incorrect types
const stageNode = computed<Konva.Stage | undefined>(() => stageRef.value?.getNode())

const getNotchHeight = (stageHeight: number) => stageHeight * 0.03
const getMenubarHeight = (stageHeight: number) => stageHeight * config.menubarHeightScale.value
const { canvasSize } = useCanvas()
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
    setInitialImageSettings()
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
  visible: config.notch.value,
  width: 125,
  x: (canvasSize.value.width) / 2 - 62.5,
}))

const menuBarConfig = computed<Konva.RectConfig>(() => ({
  fill: 'black',
  height: canvasSize.value.height * config.menubarHeightScale.value,
  width: canvasSize.value.width,
}))

watch([windowWidth, config.resolution], () => {
  if (!stageNode.value)
    return

  const { height, width } = canvasSize.value

  stageNode.value.setSize({ height: height + getMenubarHeight(height), width })
  setInitialImageSettings()
})

const imageConfig = computed<Konva.ImageConfig>(() => ({
  dragBoundFunc,
  draggable: true,
  image: (selectedImage.value as CanvasImageSource) || undefined,
}))

function setInitialImageSettings() {
  if (!imageRef.value || !stageNode.value || !selectedImage.value)
    return { height: 0, width: 0 }

  // @ts-expect-error incorrect types
  const image: Konva.Image = imageRef.value.getNode()

  let targetHeight = 0
  let targetWidth = 0

  const imageAspect = selectedImage.value.naturalWidth / selectedImage.value.naturalHeight
  const isLandscape = selectedImage.value.naturalWidth > selectedImage.value.naturalHeight

  if (isLandscape) {
    targetHeight = stageNode.value.height() - getMenubarHeight(stageNode.value.height())
    targetWidth = targetHeight * imageAspect
  }
  else {
    targetWidth = stageNode.value.width()
    targetHeight = targetWidth / imageAspect - getMenubarHeight(stageNode.value.height())
  }

  if (targetWidth < stageNode.value.width()) {
    targetWidth = stageNode.value.width()
    targetHeight = targetWidth / imageAspect - getMenubarHeight(stageNode.value.height())
  }

  image.position({ x: 0, y: getMenubarHeight(stageNode.value.height()) })
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
    x = Math.max(pos.x > 0 ? 0 : pos.x, stageNode.value.width() - image.getWidth() * image.scaleX())
  }
  else {
    x = Math.min(pos.x < 0 ? 0 : pos.x, stageNode.value.width() - image.getWidth() * image.scaleX())
  }

  if (stageNode.value.height() <= image.getHeight() * image.scaleY()) {
    y = Math.max(pos.y > getMenubarHeight(stageNode.value.height()) ? getMenubarHeight(stageNode.value.height()) : pos.y, stageNode.value.height() - image.getHeight() * image.scaleY())
  }
  else {
    y = Math.min(pos.y < getMenubarHeight(stageNode.value.height()) ? getMenubarHeight(stageNode.value.height()) : pos.y, stageNode.value.height() - image.getHeight() * image.scaleY())
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
  const stage: Konva.Stage = stageRef.value?.getNode()

  // @ts-expect-error incorrect types
  const konvaImage: Konva.Image = imageRef.value?.getNode()
  const source = konvaImage.image() as HTMLImageElement | undefined
  if (!stage || !source)
    return

  const targetAspect = config.resolution.value

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
    height: cropHeight,
    pixelRatio,
    quality: 1,
    width: cropWidth,
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

  setInitialImageSettings()
})
</script>

<template>
  <div class="relative z-10 overflow-hidden rounded-b-none bg-black shadow-lg">
    <v-stage
      ref="stageRef"
      :config="{
        ...canvasSize,
      }"
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
            visible: config.corners.value.tl,
            height: cornerSize,
            image: cornerImage ?? undefined,
            rotation: 90,
            width: cornerSize,
            x: cornerSize,
            y: stageNode?.height() ? stageNode.height() * config.menubarHeightScale.value - 0.75 : 0,
          }"
        />
        <!-- top right -->
        <v-image
          :config="{
            visible: config.corners.value.tr,
            height: cornerSize,
            image: cornerImage ?? undefined,
            rotation: 180,
            width: cornerSize,
            x: stageNode?.width() ? stageNode.width() : 0,
            y: stageNode?.height() ? stageNode.height() * config.menubarHeightScale.value + cornerSize - 0.75 : 0,
          }"
        />
        <!-- bottom left -->
        <v-image
          :config="{
            visible: config.corners.value.bl,
            height: cornerSize,
            image: cornerImage ?? undefined,
            width: cornerSize,
            y: stageNode?.height() ? stageNode.height() - cornerSize : 0,
          }"
        />
        <!-- bottom right -->
        <v-image
          :config="{
            visible: config.corners.value.br,
            rotation: 270,
            height: cornerSize,
            image: cornerImage ?? undefined,
            width: cornerSize,
            x: stageNode?.width() ? stageNode.width() - cornerSize : 0,
            y: stageNode?.height() ? stageNode.height() : 0,
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>
