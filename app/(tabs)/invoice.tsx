import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StatusBar,
	StyleSheet,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ContactHeader,
	FloatingShareButton,
	InvoiceList,
	SearchBar,
} from "@/components";
import { useInvoices } from "@/hooks";
import { useInvoiceStore } from "@/store/invoiceStore";
import type { Invoice } from "@/types";
import { generateMergedInvoiceHtml } from "@/utils/pdfTemplate";

export default function InvoiceScreen() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const [isSharing, setIsSharing] = useState(false);

	const {
		invoices,
		selectionMode,
		searchText,
		setSearchText,
		toggleInvoice,
		enableSelectionMode,
		getSelectedCount,
		cancelSelection,
	} = useInvoices();

	const handleInvoicePress = (invoice: Invoice) => {
		router.push(`/invoice/${invoice.id}`);
	};

	const handleSharePress = async () => {
		const selectedCount = getSelectedCount();
		if (selectedCount === 0) {
			Alert.alert(
				"No Selection",
				"Please select at least one invoice to share.",
			);
			return;
		}

		Alert.alert(
			"Share Invoices",
			`Generate and share ${selectedCount} selected invoice${selectedCount > 1 ? "s" : ""} as a single PDF?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Share",
					style: "default",
					onPress: async () => {
						try {
							setIsSharing(true);
							// 1. Get selected IDs
							const selectedIds = invoices
								.filter((i) => i.checked)
								.map((i) => i.id);

							// 2. Fetch full invoice details from store
							const fullInvoices = selectedIds
								.map((id) => useInvoiceStore.getState().getInvoiceById(id))
								.filter((i): i is NonNullable<typeof i> => i !== null);

							if (fullInvoices.length === 0) {
								Alert.alert("Error", "Could not fetch details for selected invoices.");
								return;
							}

							// 3. Prepare data for template
							const invoiceData = fullInvoices.map((inv) => ({
								invoiceNumber: inv.invoiceNumber,
								// Use the same date formatting as the list or raw?
								// Let's use a nice format for the PDF
								date: new Date(inv.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								}),
								customerName: inv.customerName,
								customerPhone: inv.customerPhone,
								items: inv.items,
								summary: {
									subtotal: inv.subtotal,
									totalDiscount: inv.totalDiscount,
									tax: inv.tax,
									total: inv.total,
								},
							}));

							// 4. Generate Merged HTML
							const html = generateMergedInvoiceHtml(
								invoiceData,
								"Vishnu Billing",
							);

							// 5. Generate PDF
							const { uri } = await Print.printToFileAsync({ html });

							// 6. Share
							await Sharing.shareAsync(uri, {
								mimeType: "application/pdf",
								dialogTitle: `Share ${selectedCount} Invoices`,
							});
						} catch (error) {
							console.error("Share error:", error);
							Alert.alert("Error", "Failed to generate or share invoices.");
						} finally {
							setIsSharing(false);
						}
					},
				},
			],
		);
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
		loadingOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0,0,0,0.5)",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 100,
		},
	});

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
					onCancel={cancelSelection}
				/>

				{/* Loading Indicator */}
				{isSharing && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color="#13ec6a" />
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
