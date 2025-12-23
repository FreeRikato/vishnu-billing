import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { invoiceStyles } from "@/styles";

interface InvoiceErrorStateProps {
	message?: string;
}

export function InvoiceErrorState({
	message = "Invoice not found",
}: InvoiceErrorStateProps) {
	return (
		<View style={invoiceStyles.errorContainer}>
			<MaterialIcons name="error-outline" size={48} color="#9ca3af" />
			<Text style={invoiceStyles.errorText}>{message}</Text>
		</View>
	);
}
