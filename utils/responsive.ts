import { Dimensions, Platform } from "react-native";

// Base dimensions (standard iPhone 11 design reference)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 375; // iPhone 11/12/13 reference width
const BASE_HEIGHT = 812; // iPhone 11/12/13 reference height

/**
 * Scale based on width (good for padding, margin, fontSize, width)
 * @param size - The size to scale
 * @returns The scaled size based on screen width
 */
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale based on height (good for height, vertical spacing)
 * @param size - The size to scale
 * @returns The scaled size based on screen height
 */
export const verticalScale = (size: number) =>
	(SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Good for font sizes - resize, but don't get TOO tiny or TOO huge
 * @param size - The size to scale moderately
 * @param factor - The scaling factor (default: 0.5)
 * @returns The moderately scaled size
 */
export const moderateScale = (size: number, factor = 0.5) =>
	size + (scale(size) - size) * factor;

export const SCREEN_DIMENSIONS = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };

// Tablet detection: 768px is standard iPad breakpoint
export const IS_TABLET = SCREEN_WIDTH > 768;

// Device type for convenience
export const DEVICE_TYPE = Platform.select({
	ios: IS_TABLET ? "ipad" : "iphone",
	android: IS_TABLET ? "tablet" : "phone",
	default: "unknown",
});
