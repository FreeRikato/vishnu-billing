import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { Contact } from "@/types";
import { contactsStyles } from "../styles/contacts";

interface ContactItemProps {
	contact: Contact;
	onEdit?: (contact: Contact) => void;
	onPress?: (contact: Contact) => void;
}

export default function ContactItem({
	contact,
	onEdit,
	onPress,
}: ContactItemProps) {
	return (
		<TouchableOpacity
			style={contactsStyles.contactItem}
			activeOpacity={0.7}
			onPress={() => onPress?.(contact)}
		>
			<View style={contactsStyles.contactInfo}>
				<View
					style={[
						contactsStyles.avatar,
						{ backgroundColor: `${contact.color}20` },
					]}
				>
					<Text style={[contactsStyles.avatarText, { color: contact.color }]}>
						{contact.initials}
					</Text>
				</View>
				<View style={contactsStyles.contactDetails}>
					<Text style={contactsStyles.contactName}>{contact.name}</Text>
					<Text style={contactsStyles.contactPhone}>{contact.phone}</Text>
				</View>
			</View>
			<TouchableOpacity
				style={contactsStyles.editButton}
				onPress={(e) => {
					e.stopPropagation();
					onEdit?.(contact);
				}}
			>
				<MaterialIcons name="edit" size={28} color="#13EC6A" />
			</TouchableOpacity>
		</TouchableOpacity>
	);
}
