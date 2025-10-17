const BodySchema = z.object({
  url: z.url(),
})

export default defineEventHandler(async (event) => {
  const { url } = await validateBodyZod(event, BodySchema)

  const isImage = await isImageUrl(url)
  if (!isImage) {
    throw createError({
      message: 'Invalid URL. Must be a valid image URL',
      statusCode: 400,
    })
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw createError({
      message: 'Failed to fetch image',
      statusCode: 500,
    })
  }

  setHeader(event, 'content-type', res.headers.get('content-type') ?? 'image/png')

  return res
})

async function isImageUrl(url: string) {
  try {
    const head = await fetch(url, { method: 'HEAD' })
    return head.headers.get('content-type')?.startsWith('image/')
  }
  catch {
    try {
      const res = await fetch(url, {
        headers: {
          Range: 'bytes=0-1024',
        },
        method: 'GET',
      })

      return res.headers.get('content-type')?.startsWith('image/')
    }
    catch {
      return false
    }
  }
}
