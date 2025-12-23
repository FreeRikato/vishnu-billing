import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

interface ZoomHintProps {
	text?: string;
}

export function ZoomHint({ text = "Pinch to zoom invoice" }: ZoomHintProps) {
	return (
		<View style={styles.zoomHint}>
			<MaterialIcons name="zoom-in" size={16} color="#9CA3AF" />
			<Text style={styles.zoomHintText}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	zoomHint: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		alignSelf: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 9999,
		paddingHorizontal: 16,
		paddingVertical: 6,
		marginBottom: 24,
	},
	zoomHintText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#9CA3AF",
	},
});
