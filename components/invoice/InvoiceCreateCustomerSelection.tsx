import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Customer } from "@/types";

interface InvoiceCreateCustomerSelectionProps {
	selectedCustomer?: Customer | null;
	onSelectCustomer: () => void;
	onCreateNewCustomer: () => void;
}

export function InvoiceCreateCustomerSelection({
	selectedCustomer,
	onSelectCustomer,
	onCreateNewCustomer,
}: InvoiceCreateCustomerSelectionProps) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Who is this for?</Text>
			<View style={styles.customerSection}>
				<TouchableOpacity
					onPress={onSelectCustomer}
					style={styles.customerSelect}
				>
					<Text
						style={
							selectedCustomer
								? styles.customerSelectedText
								: styles.customerSelectText
						}
					>
						{selectedCustomer ? selectedCustomer.name : "Select Customer"}
					</Text>
					<MaterialIcons name="expand-more" size={24} color="#13ec6a" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onCreateNewCustomer}
					style={styles.createCustomerButton}
				>
					<AntDesign name="user-add" size={24} color="#13ec6a" />
					<Text style={styles.createCustomerText}>Create New Customer</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 24,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	customerSection: {
		gap: 12,
	},
	customerSelect: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#121212",
		borderWidth: 2,
		borderColor: "#374151",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	customerSelectText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#9ca3af",
	},
	customerSelectedText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
	},
	createCustomerButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		borderWidth: 1,
		borderColor: "#374151",
		borderStyle: "dashed",
		borderRadius: 12,
		paddingVertical: 16,
		backgroundColor: "transparent",
	},
	createCustomerText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#13ec6a",
	},
});
