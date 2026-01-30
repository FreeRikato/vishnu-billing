import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import type { Customer } from "@/types";
import { scale } from "@/utils/responsive";

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
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>Who is this for?</Text>
			<View style={invoiceStyles.customerSection}>
				<TouchableOpacity
					onPress={onSelectCustomer}
					style={invoiceStyles.customerSelect}
				>
					<Text
						style={
							selectedCustomer
								? invoiceStyles.customerSelectedText
								: invoiceStyles.customerSelectText
						}
					>
						{selectedCustomer ? selectedCustomer.name : "Select Customer"}
					</Text>
					<MaterialIcons name="expand-more" size={scale(24)} color="#13ec6a" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onCreateNewCustomer}
					style={invoiceStyles.createCustomerButton}
				>
					<AntDesign name="user-add" size={scale(24)} color="#13ec6a" />
					<Text style={invoiceStyles.createCustomerText}>
						Create New Customer
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
