import { ActivityIndicator, Text, View } from "react-native";
import { invoiceStyles } from "@/styles";

interface InvoiceLoadingOverlayProps {
	message?: string;
}

export function InvoiceLoadingOverlay({
	message = "Generating PDF...",
}: InvoiceLoadingOverlayProps) {
	return (
		<View style={invoiceStyles.loadingOverlay}>
			<ActivityIndicator size="large" color="#13ec6a" />
			<Text style={invoiceStyles.loadingText}>{message}</Text>
		</View>
	);
}
