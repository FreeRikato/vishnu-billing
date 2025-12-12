import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import ContactHeader from "@/components/ContactHeader";
import ContactList from "@/components/ContactList";
import FloatingAddActionButton from "@/components/FloatingAddActionButton";
import SearchBar from "@/components/SearchBar";
import { useContacts } from "@/hooks/useContacts";
import type { Contact } from "@/types";
import { contactsStyles } from "../../styles/contacts";

export default function ContactScreen() {
	const { searchText, setSearchText, contacts, loading } = useContacts();
	const router = useRouter();

	const handleSettingsPress = () => {
		Alert.alert("Settings", "Settings functionality coming soon!");
	};

	const handleEditContact = (contact: Contact) => {
		router.push(`/contact/${contact.id}`);
	};

	const handlePressContact = (contact: Contact) => {
		Alert.alert(
			"Contact Details",
			`Selected ${contact.name}\n${contact.phone}`,
		);
	};

	const handleAddContact = () => {
		router.push("/contact/create");
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
