import { FlatList, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";
import type { Invoice } from "@/types";
import InvoiceItem from "./InvoiceItem";

interface InvoiceListProps {
	invoices: Invoice[];
	onToggleInvoice?: (id: number) => void;
	onLongPressInvoice?: () => void;
	onPressInvoice?: (invoice: Invoice) => void;
	selectionMode: boolean;
}

export default function InvoiceList({
	invoices,
	onToggleInvoice,
	onLongPressInvoice,
	onPressInvoice,
	selectionMode,
}: InvoiceListProps) {
	const renderInvoiceItem = ({ item }: { item: Invoice }) => (
		<InvoiceItem
			item={item}
			onToggle={onToggleInvoice}
			onLongPress={selectionMode ? undefined : onLongPressInvoice}
			onPress={!selectionMode ? () => onPressInvoice?.(item) : undefined}
			selectionMode={selectionMode}
		/>
	);

	return (
		<FlatList
			style={contactsStyles.contactList}
			data={invoices}
			renderItem={renderInvoiceItem}
			keyExtractor={(item) => String(item.id)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
			ListFooterComponent={<View style={contactsStyles.bottomSpacer} />}
		/>
	);
}
