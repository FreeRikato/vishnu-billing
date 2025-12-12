import { ScrollView, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";
import type { Contact } from "@/types";
import ContactItem from "./ContactItem";

interface ContactListProps {
	contacts: Contact[];
	onEditContact?: (contact: Contact) => void;
	onPressContact?: (contact: Contact) => void;
}

export default function ContactList({
	contacts,
	onEditContact,
	onPressContact,
}: ContactListProps) {
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
