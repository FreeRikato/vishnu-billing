import { ActivityIndicator, FlatList, View } from "react-native";
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
	const renderContactItem = ({ item }: { item: Contact }) => (
		<ContactItem
			contact={item}
			onEdit={onEditContact}
			onPress={onPressContact}
		/>
	);

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
		<FlatList
			style={contactsStyles.contactList}
			data={contacts}
			renderItem={renderContactItem}
			keyExtractor={(item) => String(item.id)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
			ListFooterComponent={<View style={contactsStyles.bottomSpacer} />}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
				autoscrollToTopThreshold: 10,
			}}
		/>
	);
}
