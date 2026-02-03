import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

/**
 * Custom hook for pinch-to-zoom functionality with pan support.
 * Zoom persists after release, double-tap to reset.
 *
 * Based on official gesture composition documentation:
 * https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/
 */
export function usePinchToZoom() {
	// Scale state for pinch-to-zoom
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);

	// Pan state for dragging while zoomed
	const offset = useSharedValue({ x: 0, y: 0 });
	const start = useSharedValue({ x: 0, y: 0 });

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: offset.value.x },
			{ translateY: offset.value.y },
			{ scale: scale.value },
		],
	}));

	// Pan gesture - allows dragging content when zoomed
	const panGesture = Gesture.Pan()
		.averageTouches(true)
		.onUpdate((e) => {
			offset.value = {
				x: e.translationX + start.value.x,
				y: e.translationY + start.value.y,
			};
		})
		.onEnd(() => {
			start.value = {
				x: offset.value.x,
				y: offset.value.y,
			};
		});

	// Pinch gesture - persistent zoom (stays after release)
	const pinchGesture = Gesture.Pinch()
		.onUpdate((event) => {
			scale.value = savedScale.value * event.scale;
		})
		.onEnd(() => {
			savedScale.value = scale.value;
		});

	// Double-tap to reset zoom and position
	const doubleTapGesture = Gesture.Tap()
		.numberOfTaps(2)
		.maxDuration(250)
		.onEnd(() => {
			"worklet";
			scale.value = withSpring(1);
			savedScale.value = 1;
			offset.value = { x: 0, y: 0 };
			start.value = { x: 0, y: 0 };
		});

	// Combine pinch and pan to work simultaneously
	const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

	return {
		pinchGesture: composedGesture,
		doubleTapGesture,
		animatedStyle,
	};
}
