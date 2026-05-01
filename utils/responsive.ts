import { Dimensions, PixelRatio } from 'react-native'

/**
 * Simple responsive sizing helper.
 *
 * Rationale:
 * - Keeps sizing consistent across devices without introducing new deps.
 * - Uses a baseline width so values authored for typical mobile screens scale predictably.
 */
const BASE_WIDTH = 375

export function scale(size: number): number {
  // Defensive: avoid NaN propagation if caller passes weird values.
  if (!Number.isFinite(size)) return 0

  const { width } = Dimensions.get('window')
  const scaled = (width / BASE_WIDTH) * size

  // Round to nearest pixel for crisp rendering.
  return PixelRatio.roundToNearestPixel(scaled)
}

