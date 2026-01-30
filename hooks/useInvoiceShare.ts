import { useState } from "react";
import { Alert } from "react-native";
import type { InvoiceWithItems } from "@/types";
import { generateMergedInvoiceHtml } from "@/utils/pdfTemplate";
import PdfService from "@/services/pdfService";

export function useInvoiceShare() {
	const [isSharing, setIsSharing] = useState(false);

	const shareInvoices = async (invoices: InvoiceWithItems[]) => {
		if (invoices.length === 0) {
			Alert.alert("No Selection", "No invoices to share.");
			return;
		}

		return new Promise<void>((resolve) => {
			Alert.alert(
				"Share Invoices",
				`Generate and share ${invoices.length} invoice${invoices.length > 1 ? "s" : ""} as a single PDF?`,
				[
					{ text: "Cancel", style: "cancel", onPress: () => resolve() },
					{
						text: "Share",
						style: "default",
						onPress: async () => {
							try {
								setIsSharing(true);

								// Prepare data for template
								const invoiceData = invoices.map((inv) => ({
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

								// Generate Merged HTML
								const html = generateMergedInvoiceHtml(invoiceData, "Vishnu Billing");

								// Generate PDF
								const uri = await PdfService.generatePdf(html);

								// Share
								await PdfService.sharePdf(uri, `Share ${invoices.length} Invoices`);
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
		shareInvoices,
	};
}
