import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { invoiceStyles } from "@/styles/invoice";
import { scale } from "@/utils/responsive";

interface PreviewButtonProps {
	onPress: () => void;
}

export function PreviewButton({ onPress }: PreviewButtonProps) {
	return (
		<TouchableOpacity onPress={onPress} style={invoiceStyles.previewButton}>
			<MaterialIcons name="description" size={scale(24)} />
			<Text style={invoiceStyles.previewButtonText}>Preview PDF</Text>
		</TouchableOpacity>
	);
}
