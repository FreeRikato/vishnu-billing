import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { contactsStyles } from "@/styles/contacts";

interface FloatingActionButtonProps {
	onPress?: () => void;
	icon?: string;
	size?: number;
	color?: string;
	backgroundColor?: string;
}

export default function FloatingAddActionButton({
	onPress,
	size = 40,
	color = "#000000",
	backgroundColor = "#13EC6A",
}: FloatingActionButtonProps) {
	return (
		<TouchableOpacity
			style={[contactsStyles.fab, { backgroundColor }]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<MaterialIcons name="add" size={size} color={color} />
		</TouchableOpacity>
	);
}
