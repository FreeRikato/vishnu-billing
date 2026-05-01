import { Dimensions, PixelRatio } from "react-native";

/**
 * Simple responsive scaling utility used across UI spacing/sizing.
 * Keeps sizing consistent across devices without introducing new deps.
 */
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Standard iPhone 11 width baseline (common in RN scaling snippets)
const BASE_WIDTH = 414;

export const scale = (size: number): number => {
  const scaled = (SCREEN_WIDTH / BASE_WIDTH) * size;
  return PixelRatio.roundToNearestPixel(scaled);
};

