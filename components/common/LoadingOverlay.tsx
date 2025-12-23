import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingOverlayProps {
	visible: boolean;
	color?: string;
}

export function LoadingOverlay({
	visible,
	color = "#13ec6a",
}: LoadingOverlayProps) {
	if (!visible) return null;

	return (
		<View style={styles.overlay}>
			<ActivityIndicator size="large" color={color} />
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
	},
});
