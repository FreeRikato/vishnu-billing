import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";

interface ContactHeaderProps {
	onSettingsPress?: () => void;
}

export default function ContactHeader({ onSettingsPress }: ContactHeaderProps) {
	return (
		<View style={contactsStyles.header}>
			<View style={contactsStyles.headerTop}>
				<Text style={contactsStyles.headerTitle}>Contacts</Text>
				<TouchableOpacity
					style={contactsStyles.settingsButton}
					onPress={onSettingsPress}
				>
					<MaterialIcons name="settings" size={32} color="#FFFFFF" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
