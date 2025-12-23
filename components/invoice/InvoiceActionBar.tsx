import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
	saveText = "Save",
	shareText = "Share",
}: InvoiceActionBarProps) {
	return (
		<View style={styles.actionBar}>
			{onPayment && (
				<TouchableOpacity
					onPress={onPayment}
					style={styles.paymentButton}
					disabled={disabled}
				>
					<MaterialIcons name="attach-money" size={24} color="#ffffff" />
					<Text style={styles.paymentButtonText}>Payment</Text>
				</TouchableOpacity>
			)}
			<TouchableOpacity
				onPress={onSave}
				style={styles.saveButton}
				disabled={disabled}
			>
				<MaterialIcons name="save-alt" size={24} color="#ffffff" />
				<Text style={styles.saveButtonText}>{saveText}</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={onShare}
				style={styles.shareButton}
				disabled={disabled}
			>
				<MaterialIcons name="share" size={24} color="#000000" />
				<Text style={styles.shareButtonText}>{shareText}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	actionBar: {
		position: "absolute",
		bottom: 30,
		left: 20,
		right: 20,
		flexDirection: "row",
		gap: 12,
	},
	paymentButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		height: 64,
		backgroundColor: "#1C1C1E",
		borderRadius: 32,
		borderWidth: 1,
		borderColor: "rgba(19, 236, 106, 0.3)",
	},
	paymentButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#ffffff",
	},
	saveButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		height: 64,
		backgroundColor: "#1C1C1E",
		borderRadius: 32,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#ffffff",
	},
	shareButton: {
		flex: 1.2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		height: 64,
		backgroundColor: "#13ec6a",
		borderRadius: 32,
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	shareButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#000000",
	},
});
