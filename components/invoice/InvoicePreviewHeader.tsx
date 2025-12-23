import EvilIcons from "@expo/vector-icons/EvilIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InvoicePreviewHeaderProps {
	title?: string;
	onBack: () => void;
}

export function InvoicePreviewHeader({
	title = "Invoice Preview",
	onBack,
}: InvoicePreviewHeaderProps) {
	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={onBack} style={styles.backButton}>
				<EvilIcons name="arrow-left" size={32} color="#FFFFFF" />
			</TouchableOpacity>
			<Text style={styles.headerTitle}>{title}</Text>
			<View style={styles.placeholder} />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		height: 64,
		backgroundColor: "#000000",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	backButton: {
		width: 48,
		height: 48,
		justifyContent: "center",
		alignItems: "flex-start",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#FFFFFF",
		textAlign: "center",
	},
	placeholder: {
		width: 64,
	},
});
