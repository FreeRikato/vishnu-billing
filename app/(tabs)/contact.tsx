import { useState } from "react";
import { Alert, View } from "react-native";
import { mockContacts } from "@/assets";
import ContactHeader from "@/components/ContactHeader";
import ContactList from "@/components/ContactList";
import FloatingAddActionButton from "@/components/FloatingAddActionButton";
import SearchBar from "@/components/SearchBar";
import { contactsStyles } from "@/styles/contacts";
import type { Contact } from "@/types";

export default function ContactScreen() {
	const [searchText, setSearchText] = useState("");

	const handleSettingsPress = () => {
		Alert.alert("Settings", "Settings functionality coming soon!");
	};

	const handleEditContact = (contact: Contact) => {
		Alert.alert("Edit Contact", `Editing ${contact.name}`);
	};

	const handlePressContact = (contact: Contact) => {
		Alert.alert(
			"Contact Details",
			`Selected ${contact.name}\n${contact.phone}`,
		);
	};

	const handleAddContact = () => {
		Alert.alert("Add Contact", "Add contact functionality coming soon!");
	};

	// Filter contacts based on search text
	const filteredContacts = mockContacts.filter(
		(contact) =>
			contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
			contact.phone.includes(searchText),
	);

	return (
		<View style={contactsStyles.container}>
			<ContactHeader onSettingsPress={handleSettingsPress} />
			<SearchBar value={searchText} onChangeText={setSearchText} />
			<ContactList
				contacts={filteredContacts}
				onEditContact={handleEditContact}
				onPressContact={handlePressContact}
			/>
			<FloatingAddActionButton onPress={handleAddContact} />
		</View>
	);
}
