export function toggleColorMode() {
  const colorMode = useColorMode()
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
