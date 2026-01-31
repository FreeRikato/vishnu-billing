import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface InvoiceCreateHeaderProps {
	onCancel: () => void;
}

export function InvoiceCreateHeader({ onCancel }: InvoiceCreateHeaderProps) {
	return (
		<View style={invoiceStyles.header}>
			<TouchableOpacity
				onPress={() => router.dismiss()}
				style={invoiceStyles.backButton}
			>
				<EvilIcons name="arrow-left" size={scale(28)} />
			</TouchableOpacity>
			<Text style={invoiceStyles.headerTitle}>Create Invoice</Text>
			<TouchableOpacity onPress={onCancel} style={invoiceStyles.cancelButton}>
				<Text style={invoiceStyles.cancelText}>Cancel</Text>
			</TouchableOpacity>
		</View>
	);
}
