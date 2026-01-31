import { FlatList, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { contactsStyles } from "@/styles/contacts";
import { invoiceStyles } from "@/styles/invoice";
import type { Invoice } from "@/types";
import InvoiceItem from "./InvoiceItem";

interface InvoiceListProps {
	invoices: Invoice[];
	onToggleInvoice?: (id: string) => void;
	onLongPressInvoice?: () => void;
	onPressInvoice?: (invoice: Invoice) => void;
	selectionMode: boolean;
	colorScheme: "light" | "dark";
}

export default function InvoiceList({
	invoices,
	onToggleInvoice,
	onLongPressInvoice,
	onPressInvoice,
	selectionMode,
	colorScheme,
}: InvoiceListProps) {
	const renderInvoiceItem = ({
		item,
		index,
	}: {
		item: Invoice;
		index: number;
	}) => (
		<Animated.View entering={FadeIn.delay(index * 50).springify()}>
			<InvoiceItem
				item={item}
				onToggle={onToggleInvoice}
				onLongPress={selectionMode ? undefined : onLongPressInvoice}
				onPress={!selectionMode ? () => onPressInvoice?.(item) : undefined}
				selectionMode={selectionMode}
				colorScheme={colorScheme}
			/>
		</Animated.View>
	);

	return (
		<FlatList
			style={contactsStyles.contactList}
			data={invoices}
			renderItem={renderInvoiceItem}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={invoiceStyles.invoiceListContent}
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
