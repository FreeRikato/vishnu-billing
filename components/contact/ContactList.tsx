import { ActivityIndicator, ScrollView, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";
import type { Contact } from "@/types";
import ContactItem from "./ContactItem";

interface ContactListProps {
	contacts: Contact[];
	onEditContact?: (contact: Contact) => void;
	onPressContact?: (contact: Contact) => void;
	loading?: boolean;
}

export default function ContactList({
	contacts,
	onEditContact,
	onPressContact,
	loading = false,
}: ContactListProps) {
	if (loading) {
		return (
			<View
				style={[contactsStyles.contactList, contactsStyles.loadingContainer]}
			>
				<ActivityIndicator size="large" color="#3B82F6" />
			</View>
		);
	}

	return (
		<ScrollView
			style={contactsStyles.contactList}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
		>
			{contacts.map((contact) => (
				<ContactItem
					key={contact.id}
					contact={contact}
					onEdit={onEditContact}
					onPress={onPressContact}
				/>
			))}

			<View style={contactsStyles.bottomSpacer} />
		</ScrollView>
	);
}
