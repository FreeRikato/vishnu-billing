import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { homeStyles } from "@/styles";

interface CreateInvoiceButtonProps {
	onPress: () => void;
}

export function CreateInvoiceButton({ onPress }: CreateInvoiceButtonProps) {
	return (
		<TouchableOpacity
			style={homeStyles.createInvoiceButton}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<MaterialIcons name="add-circle" size={30} color="white" />
			<Text style={homeStyles.createInvoiceText}>Create New Invoice</Text>
		</TouchableOpacity>
	);
}
