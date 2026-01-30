import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface InvoiceActionBarProps {
	onSave: () => void;
	onShare: () => void;
	onPayment?: () => void;
	disabled?: boolean;
	saveText?: string;
	shareText?: string;
}

export function InvoiceActionBar({
	onSave,
	onShare,
	onPayment,
	disabled = false,
}: InvoiceActionBarProps) {
	return (
		<View style={invoiceStyles.actionBar}>
			{onPayment && (
				<TouchableOpacity
					onPress={onPayment}
					style={invoiceStyles.paymentButton}
					disabled={disabled}
				>
					<MaterialIcons
						name="currency-rupee"
						size={scale(24)}
						color="#ffffff"
					/>
				</TouchableOpacity>
			)}
			<TouchableOpacity
				onPress={onSave}
				style={invoiceStyles.saveButton}
				disabled={disabled}
			>
				<MaterialIcons name="save-alt" size={scale(24)} color="#ffffff" />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={onShare}
				style={invoiceStyles.shareButton}
				disabled={disabled}
			>
				<MaterialIcons name="share" size={scale(24)} color="#000000" />
			</TouchableOpacity>
		</View>
	);
}
