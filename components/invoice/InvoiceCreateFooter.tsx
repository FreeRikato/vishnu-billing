import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface InvoiceCreateFooterProps {
	onPress: () => void;
}

export function InvoiceCreateFooter({ onPress }: InvoiceCreateFooterProps) {
	return (
		<View style={invoiceStyles.footer}>
			<TouchableOpacity onPress={onPress} style={invoiceStyles.createButton}>
				<MaterialIcons name="description" size={scale(24)} />
				<Text style={invoiceStyles.createButtonText}>Create Invoice</Text>
			</TouchableOpacity>
		</View>
	);
}
