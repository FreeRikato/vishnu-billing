import { useState } from "react";
import { Alert } from "react-native";
import PdfService from "@/services/pdfService";
import { useInvoiceStore } from "@/store/invoiceStore";
import type { Invoice } from "@/types";
import { generateMergedInvoiceHtml } from "@/utils/pdfTemplate";

export function useInvoiceShare() {
	const [isSharing, setIsSharing] = useState(false);

	const shareSelectedInvoices = async (invoices: Invoice[]) => {
		const selectedCount = invoices.filter((i) => i.checked).length;
		if (selectedCount === 0) {
			Alert.alert(
				"No Selection",
				"Please select at least one invoice to share.",
			);
			return;
		}

		return new Promise<void>((resolve) => {
			Alert.alert(
				"Share Invoices",
				`Generate and share ${selectedCount} selected invoice${selectedCount > 1 ? "s" : ""} as a single PDF?`,
				[
					{ text: "Cancel", style: "cancel", onPress: () => resolve() },
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
									Alert.alert(
										"Error",
										"Could not fetch details for selected invoices.",
									);
									return;
								}

								// 3. Prepare data for template
								const invoiceData = fullInvoices.map((inv) => ({
									invoiceNumber: inv.invoiceNumber,
									date: new Date(inv.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									}),
									customerName: inv.customerName,
									customerPhone: inv.customerPhone,
									customerAddress: inv.customerAddress,
									customerGstin: inv.customerGstin,
									customerDlNo: inv.customerDlNo,
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
								const uri = await PdfService.generatePdf(html);

								// 6. Share
								await PdfService.sharePdf(
									uri,
									`Share ${selectedCount} Invoices`,
								);
							} catch (error) {
								console.error("Share error:", error);
								Alert.alert("Error", "Failed to generate or share invoices.");
							} finally {
								setIsSharing(false);
								resolve();
							}
						},
					},
				],
			);
		});
	};

	return {
		isSharing,
		shareSelectedInvoices,
	};
}
