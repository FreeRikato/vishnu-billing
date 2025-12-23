import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

/**
 * Custom hook for pinch-to-zoom functionality.
 * Provides gesture and animated style for zooming on Android.
 */
export function usePinchToZoom() {
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);

	const pinchGesture = useMemo(
		() =>
			Gesture.Pinch()
				.onUpdate((e) => {
					scale.value = savedScale.value * e.scale;
				})
				.onEnd(() => {
					// Snap back to 1 on release for Android to ensure usability
					scale.value = withSpring(1);
					savedScale.value = 1;
				}),
		[scale, savedScale],
	);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		zIndex: 10, // Ensure it sits on top when zooming
	}));

	return { pinchGesture, animatedStyle };
}
