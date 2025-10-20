import type Konva from 'konva'

export function createCornerShape(ctx: Konva.Context, shape: Konva.Shape) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, 11)
  ctx.lineTo(11, 11)
  ctx.quadraticCurveTo(0, 11, 0, 0)
  ctx.closePath()

  ctx.fillStrokeShape(shape)
}
