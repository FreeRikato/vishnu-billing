import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InvoiceCreateHeaderProps {
	onCancel: () => void;
}

export function InvoiceCreateHeader({ onCancel }: InvoiceCreateHeaderProps) {
	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
				<EvilIcons name="arrow-left" size={28} />
			</TouchableOpacity>
			<Text style={styles.headerTitle}>Create Invoice</Text>
			<TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
				<Text style={styles.cancelText}>Cancel</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		height: 64,
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "#374151",
	},
	backButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "800",
		flex: 1,
		textAlign: "center",
		color: "#ffffff",
	},
	cancelButton: {
		paddingHorizontal: 8,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	},
	cancelText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#9db9a8",
	},
});
