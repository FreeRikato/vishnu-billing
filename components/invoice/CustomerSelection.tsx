import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles/invoice";

interface CustomerSelectionProps {
	onSelectCustomer: () => void;
	onCreateNewCustomer: () => void;
}

export function CustomerSelection({
	onSelectCustomer,
	onCreateNewCustomer,
}: CustomerSelectionProps) {
	return (
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>Who is this for?</Text>
			<View style={invoiceStyles.customerSection}>
				<TouchableOpacity
					onPress={onSelectCustomer}
					style={invoiceStyles.customerSelect}
				>
					<Text style={invoiceStyles.customerSelectText}>Select Customer</Text>
					<MaterialIcons name="expand-more" size={24} color="#13ec6a" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onCreateNewCustomer}
					style={invoiceStyles.createCustomerButton}
				>
					<AntDesign name="user-add" size={24} color="#13ec6a" />
					<Text style={invoiceStyles.createCustomerText}>
						Create New Customer
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
