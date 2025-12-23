import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { productsStyles } from "@/styles";

interface ProductDeleteSectionProps {
	onDelete: () => void;
}

export function ProductDeleteSection({ onDelete }: ProductDeleteSectionProps) {
	return (
		<View style={productsStyles.deleteSection}>
			<TouchableOpacity style={productsStyles.deleteButton} onPress={onDelete}>
				<MaterialIcons name="delete-forever" size={24} color="#EF4444" />
				<Text style={productsStyles.deleteButtonText}>Delete Product</Text>
			</TouchableOpacity>
			<Text style={productsStyles.deleteWarning}>
				This action cannot be undone.
			</Text>
		</View>
	);
}
