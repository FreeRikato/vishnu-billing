import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ContactHeader,
	ContactList,
	FloatingAddActionButton,
	SearchBar,
} from "@/components";
import { useContacts } from "@/hooks/useContacts";
import { contactsStyles } from "@/styles/contacts";
import type { Contact } from "@/types";

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
		<SafeAreaView
			style={contactsStyles.container}
			edges={["top", "left", "right"]}
		>
			<ContactHeader onSettingsPress={handleSettingsPress} />
			<SearchBar value={searchText} onChangeText={setSearchText} />
			<ContactList
				contacts={contacts}
				onEditContact={handleEditContact}
				onPressContact={handlePressContact}
				loading={loading}
			/>
			<FloatingAddActionButton onPress={handleAddContact} small />
		</SafeAreaView>
	);
}
