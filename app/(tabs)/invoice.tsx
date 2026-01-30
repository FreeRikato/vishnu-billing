import { router } from "expo-router";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ContactHeader,
	FloatingShareButton,
	InvoiceList,
	LoadingOverlay,
	SearchBar,
} from "@/components";
import { useInvoiceShare, useInvoices } from "@/hooks";
import { invoiceStyles } from "@/styles/invoice";
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
		cancelSelection,
	} = useInvoices();

	const { isSharing, shareInvoices } = useInvoiceShare();

	const handleInvoicePress = (invoice: Invoice) => {
		router.push(`/invoice/${invoice.id}`);
	};

	const handleSharePress = async () => {
		// Filter selected invoices and get full invoice data
		const selectedInvoices = invoices.filter((i) => i.checked);
		// Note: shareInvoices expects full InvoiceWithItems[], which should be fetched from Convex
		// For now, we'll just share based on the UI data
		await shareInvoices(selectedInvoices as any);
	};

	return (
		<SafeAreaView
			style={invoiceStyles.container}
			edges={["top", "left", "right"]}
		>
			<StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
			<View
				style={
					isDark
						? invoiceStyles.listContainer
						: invoiceStyles.listLightContainer
				}
			>
				{/* Header */}
				<ContactHeader title="Invoice History" />

				{/* Search Bar */}
				<View
					style={
						isDark
							? invoiceStyles.listSearchContainer
							: invoiceStyles.listLightSearchContainer
					}
				>
					<SearchBar
						value={searchText}
						onChangeText={setSearchText}
						placeholder="Search by name or date"
					/>
				</View>

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
					selectedCount={invoices.filter((i) => i.checked).length}
					onPress={handleSharePress}
					onCancel={cancelSelection}
				/>

				{/* Loading Indicator */}
				<LoadingOverlay visible={isSharing} />
			</View>
		</SafeAreaView>
	);
}
