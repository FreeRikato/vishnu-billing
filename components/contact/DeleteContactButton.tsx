import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteContactButtonProps {
	onPress: () => void;
}

export default function DeleteContactButton({
	onPress,
}: DeleteContactButtonProps) {
	return (
		<View style={styles.deleteSection}>
			<TouchableOpacity style={styles.deleteButton} onPress={onPress}>
				<MaterialIcons name="delete-forever" size={24} color="#EF4444" />
				<Text style={styles.deleteButtonText}>Delete Contact</Text>
			</TouchableOpacity>
			<Text style={styles.deleteWarning}>This action cannot be undone.</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	deleteSection: {
		paddingTop: 32,
		paddingBottom: 16,
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 20,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "rgba(239, 68, 68, 0.3)",
		backgroundColor: "rgba(239, 68, 68, 0.05)",
		marginBottom: 16,
	},
	deleteButtonText: {
		color: "#EF4444",
		fontSize: 20,
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	deleteWarning: {
		textAlign: "center",
		color: "#6B7280",
		fontSize: 14,
		fontWeight: "500",
	},
});
