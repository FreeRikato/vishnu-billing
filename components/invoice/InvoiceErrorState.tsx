import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

interface InvoiceErrorStateProps {
	message?: string;
}

export function InvoiceErrorState({
	message = "Invoice not found",
}: InvoiceErrorStateProps) {
	return (
		<View style={styles.errorContainer}>
			<MaterialIcons name="error-outline" size={48} color="#9ca3af" />
			<Text style={styles.errorText}>{message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	errorText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#9ca3af",
	},
});
