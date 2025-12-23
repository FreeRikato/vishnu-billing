import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface InvoiceLoadingOverlayProps {
	message?: string;
}

export function InvoiceLoadingOverlay({
	message = "Generating PDF...",
}: InvoiceLoadingOverlayProps) {
	return (
		<View style={styles.loadingOverlay}>
			<ActivityIndicator size="large" color="#13ec6a" />
			<Text style={styles.loadingText}>{message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
		zIndex: 50,
	},
	loadingText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffffff",
	},
});
