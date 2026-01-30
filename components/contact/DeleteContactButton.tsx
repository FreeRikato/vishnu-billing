import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { contactsStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface DeleteContactButtonProps {
	onPress: () => void;
}

export default function DeleteContactButton({
	onPress,
}: DeleteContactButtonProps) {
	return (
		<View style={contactsStyles.deleteSection}>
			<TouchableOpacity style={contactsStyles.deleteButton} onPress={onPress}>
				<MaterialIcons name="delete-forever" size={scale(24)} color="#EF4444" />
				<Text style={contactsStyles.deleteButtonText}>Delete Contact</Text>
			</TouchableOpacity>
			<Text style={contactsStyles.deleteWarning}>
				This action cannot be undone.
			</Text>
		</View>
	);
}
