import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// This project doesn't currently have a shared responsive utility, but the UI request
// expects one. We keep it intentionally small and deterministic: scale values relative
// to a common mobile baseline width.
const BASE_WIDTH = 375

export function scale(value: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * value
}

