import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface InvoiceCreateFooterProps {
	onPress: () => void;
}

export function InvoiceCreateFooter({ onPress }: InvoiceCreateFooterProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			style={[
				invoiceStyles.footer,
				{ paddingBottom: Math.max(scale(24), insets.bottom + scale(10)) },
			]}
		>
			<TouchableOpacity onPress={onPress} style={invoiceStyles.createButton}>
				<MaterialIcons name="description" size={scale(24)} />
				<Text style={invoiceStyles.createButtonText}>Create Invoice</Text>
			</TouchableOpacity>
		</View>
	);
}
