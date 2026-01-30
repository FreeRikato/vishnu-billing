import { MaterialIcons } from "@expo/vector-icons";
import {
	Keyboard,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { contactsStyles } from "@/styles/contacts";
import { scale } from "@/utils/responsive";

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
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={contactsStyles.searchContainer}>
				<MaterialIcons
					name="search"
					size={scale(28)}
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
		</TouchableWithoutFeedback>
	);
}
