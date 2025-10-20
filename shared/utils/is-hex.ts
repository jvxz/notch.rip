export function isHex(value: string): boolean {
  return /^#?[0-9a-f]{3}(?:[0-9a-f]{3})?(?:[0-9a-f]{2})?$/i.test(value)
}
