import {
	Alert,
	StatusBar,
	StyleSheet,
	useColorScheme,
	View,
} from "react-native";
import {
	ContactHeader,
	FloatingShareButton,
	InvoiceList,
	SearchBar,
} from "@/components";
import { useInvoices } from "@/hooks";
import type { Invoice } from "@/types";

export default function InvoiceScreen() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const {
		invoices,
		selectionMode,
		searchText,
		setSearchText,
		toggleInvoice,
		enableSelectionMode,
		getSelectedCount,
	} = useInvoices();

	const handleInvoicePress = (invoice: Invoice) => {
		Alert.alert(
			"Invoice Details",
			`Customer: ${invoice.customerName}\nInvoice: ${invoice.invoiceNumber}\nAmount: ${invoice.amount}\nDate: ${invoice.date}\nStatus: ${invoice.status}`,
			[{ text: "OK", style: "default" }],
		);
	};

	const handleSharePress = () => {
		const selectedCount = getSelectedCount();
		if (selectedCount === 0) {
			Alert.alert(
				"No Selection",
				"Please select at least one invoice to share.",
			);
		} else {
			Alert.alert(
				"Share Invoices",
				`Share ${selectedCount} selected invoice${selectedCount > 1 ? "s" : ""}?`,
				[
					{ text: "Cancel", style: "cancel" },
					{ text: "Share", style: "default" },
				],
			);
		}
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: isDark ? "#000000" : "#f6f8f7",
		},
		safeArea: {
			flex: 1,
		},
		searchContainer: {
			position: "absolute",
			top: 73,
			left: 0,
			right: 0,
			zIndex: 30,
			backgroundColor: isDark ? "#000000" : "#f6f8f7",
			paddingHorizontal: 16,
			paddingBottom: 8,
		},
	});

	return (
		<View style={styles.safeArea}>
			<StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
			<View style={styles.container}>
				{/* Header */}
				<ContactHeader title="Invoice History" />

				{/* Search Bar */}
				<SearchBar
					value={searchText}
					onChangeText={setSearchText}
					placeholder="Search by name or date"
				/>

				{/* Invoice List */}
				<InvoiceList
					invoices={invoices}
					onToggleInvoice={toggleInvoice}
					onLongPressInvoice={enableSelectionMode}
					onPressInvoice={handleInvoicePress}
					selectionMode={selectionMode}
				/>

				{/* Floating Share Button */}
				<FloatingShareButton
					visible={selectionMode}
					selectedCount={getSelectedCount()}
					onPress={handleSharePress}
				/>
			</View>
		</View>
	);
}
