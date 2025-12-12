import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { contactsStyles } from "../styles/contacts";

interface FloatingActionButtonProps {
	onPress?: () => void;
	icon?: string;
	size?: number;
	color?: string;
	backgroundColor?: string;
	small?: boolean;
}

export default function FloatingAddActionButton({
	onPress,
	size = 32,
	color = "#000000",
	backgroundColor = "#13EC6A",
	small = false,
}: FloatingActionButtonProps) {
	return (
		<TouchableOpacity
			style={[
				small ? contactsStyles.fabSmall : contactsStyles.fab,
				{ backgroundColor },
			]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<MaterialIcons name="add" size={size} color={color} />
		</TouchableOpacity>
	);
}
