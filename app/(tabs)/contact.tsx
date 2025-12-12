import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import ContactHeader from "@/components/ContactHeader";
import ContactList from "@/components/ContactList";
import FloatingAddActionButton from "@/components/FloatingAddActionButton";
import SearchBar from "@/components/SearchBar";
import { getAllContacts, searchContacts } from "@/services/contactService";
import type { Contact } from "@/types";
import { contactsStyles } from "../../styles/contacts";

export default function ContactScreen() {
	const [searchText, setSearchText] = useState("");
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);

	const loadContacts = useCallback(async () => {
		try {
			setLoading(true);
			const allContacts = await getAllContacts();
			setContacts(allContacts);
		} catch (error) {
			console.error("Error loading contacts:", error);
			Alert.alert("Error", "Failed to load contacts");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearchContacts = useCallback(async (query: string) => {
		try {
			setLoading(true);
			const searchResults = await searchContacts(query);
			setContacts(searchResults);
		} catch (error) {
			console.error("Error searching contacts:", error);
			Alert.alert("Error", "Failed to search contacts");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadContacts();
	}, [loadContacts]);

	useFocusEffect(
		useCallback(() => {
			loadContacts();
		}, [loadContacts]),
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (searchText.trim()) {
				handleSearchContacts(searchText);
			} else {
				loadContacts();
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchText, loadContacts, handleSearchContacts]);

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

	return (
		<View style={contactsStyles.container}>
			<ContactHeader onSettingsPress={handleSettingsPress} />
			<SearchBar value={searchText} onChangeText={setSearchText} />
			<ContactList
				contacts={contacts}
				onEditContact={handleEditContact}
				onPressContact={handlePressContact}
				loading={loading}
			/>
			<FloatingAddActionButton onPress={handleAddContact} small />
		</View>
	);
}
