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

	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			"worklet";
			scale.value = savedScale.value * e.scale;
		})
		.onEnd(() => {
			"worklet";
			// Snap back to 1 on release for Android to ensure usability
			scale.value = withSpring(1);
			savedScale.value = 1;
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		zIndex: 10, // Ensure it sits on top when zooming
	}));

	return { pinchGesture, animatedStyle };
}
