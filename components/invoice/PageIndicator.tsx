import { StyleSheet, Text, View } from "react-native";

interface PageIndicatorProps {
	current?: number;
	total?: number;
}

export function PageIndicator({ current = 1, total = 1 }: PageIndicatorProps) {
	return (
		<View style={styles.pageIndicator}>
			<Text style={styles.pageIndicatorText}>
				Page {current} of {total}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	pageIndicator: {
		marginTop: 24,
		alignSelf: "center",
		backgroundColor: "#1C1C1E",
		borderRadius: 9999,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		paddingHorizontal: 12,
		paddingVertical: 4,
	},
	pageIndicatorText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#9CA3AF",
	},
});
