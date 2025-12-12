import { useState } from "react";
import { Alert, View } from "react-native";
import ContactHeader from "@/components/ContactHeader";
import type { Contact } from "@/components/ContactItem";
import ContactList from "@/components/ContactList";
import FloatingAddActionButton from "@/components/FloatingAddActionButton";
import SearchBar from "@/components/SearchBar";
import { contactsStyles } from "@/styles/contacts";

const mockContacts: Contact[] = [
	{
		id: 1,
		name: "John Doe",
		phone: "(555) 123-4567",
		initials: "JD",
		color: "#3B82F6",
	},
	{
		id: 2,
		name: "Alice Smith",
		phone: "(555) 987-6543",
		initials: "AS",
		color: "#8B5CF6",
	},
	{
		id: 3,
		name: "Bob's Hardware",
		phone: "(555) 555-5555",
		initials: "BH",
		color: "#F97316",
	},
	{
		id: 4,
		name: "Mike's Motors",
		phone: "(555) 234-8765",
		initials: "MM",
		color: "#10B981",
	},
	{
		id: 5,
		name: "Sarah Wright",
		phone: "(555) 999-0000",
		initials: "SW",
		color: "#14B8A6",
	},
];

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
