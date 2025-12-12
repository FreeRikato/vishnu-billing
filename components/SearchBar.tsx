import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChangeText,
	placeholder = "Search Contacts...",
}: SearchBarProps) {
	return (
		<View style={contactsStyles.searchContainer}>
			<MaterialIcons
				name="search"
				size={28}
				color="#9CA3AF"
				style={contactsStyles.searchIcon}
			/>
			<TextInput
				style={contactsStyles.searchInput}
				placeholder={placeholder}
				placeholderTextColor="#9CA3AF"
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
	);
}
