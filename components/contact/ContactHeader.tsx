import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";
import { scale } from "@/utils/responsive";

interface ContactHeaderProps {
	onSettingsPress?: () => void;
	title?: string;
	showSettings?: boolean;
}

export default function ContactHeader({
	onSettingsPress,
	title = "Contacts",
	showSettings = true,
}: ContactHeaderProps) {
	return (
		<View style={contactsStyles.header}>
			<View style={contactsStyles.headerTop}>
				<Text style={contactsStyles.headerTitle}>{title}</Text>
				{showSettings && (
					<TouchableOpacity
						style={contactsStyles.settingsButton}
						onPress={onSettingsPress}
					>
						<MaterialIcons name="settings" size={scale(32)} color="#FFFFFF" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
