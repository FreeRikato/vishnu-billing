import { ActivityIndicator, FlatList, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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
	const renderContactItem = ({
		item,
		index,
	}: {
		item: Contact;
		index: number;
	}) => (
		<Animated.View entering={FadeIn.delay(index * 50).springify()}>
			<ContactItem
				contact={item}
				onEdit={onEditContact}
				onPress={onPressContact}
			/>
		</Animated.View>
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
			removeClippedSubviews={true}
			maxToRenderPerBatch={10}
			updateCellsBatchingPeriod={50}
			initialNumToRender={10}
			windowSize={5}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
				autoscrollToTopThreshold: 10,
			}}
		/>
	);
}
