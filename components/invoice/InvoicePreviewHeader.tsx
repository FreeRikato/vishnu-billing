import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";

interface InvoicePreviewHeaderProps {
	title?: string;
	onBack: () => void;
}

export function InvoicePreviewHeader({
	title = "Invoice Preview",
	onBack,
}: InvoicePreviewHeaderProps) {
	return (
		<View style={invoiceStyles.header}>
			<TouchableOpacity onPress={onBack} style={invoiceStyles.backButton}>
				<EvilIcons name="arrow-left" size={32} color="#FFFFFF" />
			</TouchableOpacity>
			<Text style={invoiceStyles.headerTitle}>{title}</Text>
			<View style={invoiceStyles.placeholder} />
		</View>
	);
}
