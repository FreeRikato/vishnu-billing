import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InvoiceCreateFooterProps {
	onPress: () => void;
}

export function InvoiceCreateFooter({ onPress }: InvoiceCreateFooterProps) {
	return (
		<View style={styles.footer}>
			<TouchableOpacity onPress={onPress} style={styles.createButton}>
				<MaterialIcons name="description" size={24} />
				<Text style={styles.createButtonText}>Create Invoice</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#000000",
		borderTopWidth: 1,
		borderTopColor: "#374151",
		paddingHorizontal: 16,
		paddingVertical: 16,
		paddingBottom: 24,
	},
	createButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: "#13ec6a",
		height: 56,
		borderRadius: 12,
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 8,
	},
	createButtonText: {
		fontSize: 18,
		fontWeight: "800",
		color: "#000000",
	},
});
