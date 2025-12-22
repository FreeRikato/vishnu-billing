import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

/**
 * PDF Service - Handles PDF generation, storage, and sharing
 * This service encapsulates all expo-print and expo-file-system operations
 */

export interface InvoicePdfData {
	senderName: string;
	invoiceNumber: string;
	date: string;
	customer: {
		name: string;
		phone: string;
	};
	items: Array<{
		id: number;
		name: string;
		description: string;
		price: number;
		quantity: number;
		discount?: {
			value: number;
			type: "flat" | "percent";
		};
	}>;
	summary: {
		subtotal: number;
		totalDiscount: number;
		tax: number;
		total: number;
	};
}

const PdfService = {
	/**
	 * Generate PDF from HTML template
	 */
	async generatePdf(html: string): Promise<string> {
		const { uri } = await Print.printToFileAsync({ html });
		return uri;
	},

	/**
	 * Save PDF to app document directory
	 */
	async savePdfToStorage(
		tempUri: string,
		fileName: string,
	): Promise<string | null> {
		try {
			const fileDir = FileSystem.documentDirectory ?? "";
			const pdfPath = `${fileDir}${fileName}`;
			await FileSystem.copyAsync({
				from: tempUri,
				to: pdfPath,
			});
			return pdfPath;
		} catch (error) {
			console.error("Error saving PDF to storage:", error);
			return null;
		}
	},

	/**
	 * Generate and save PDF in one operation
	 */
	async generateAndSavePdf(
		html: string,
		fileName: string,
	): Promise<{ tempUri: string; savedPath?: string } | null> {
		try {
			const tempUri = await this.generatePdf(html);
			const savedPath = await this.savePdfToStorage(tempUri, fileName);
			return { tempUri, savedPath: savedPath ?? undefined };
		} catch (error) {
			console.error("Error generating and saving PDF:", error);
			return null;
		}
	},

	/**
	 * Share PDF via native sharing sheet
	 */
	async sharePdf(
		uri: string,
		title: string,
	): Promise<{ success: boolean; cancelled?: boolean }> {
		try {
			const isAvailable = await Sharing.isAvailableAsync();
			if (!isAvailable) {
				return { success: false };
			}

			await Sharing.shareAsync(uri, {
				mimeType: "application/pdf",
				dialogTitle: title,
			});

			return { success: true };
		} catch (error) {
			// User cancelled sharing is not an error
			if (error instanceof Error && error.message.includes("cancelled")) {
				return { success: true, cancelled: true };
			}
			console.error("Error sharing PDF:", error);
			return { success: false };
		}
	},

	/**
	 * Check if a PDF file exists at the given path
	 */
	async pdfExists(path: string): Promise<boolean> {
		try {
			const fileInfo = await FileSystem.getInfoAsync(path);
			return fileInfo.exists;
		} catch {
			return false;
		}
	},

	/**
	 * Delete a PDF file
	 */
	async deletePdf(path: string): Promise<boolean> {
		try {
			await FileSystem.deleteAsync(path);
			return true;
		} catch (error) {
			console.error("Error deleting PDF:", error);
			return false;
		}
	},

	/**
	 * Generate a unique PDF filename based on timestamp
	 */
	generateFileName(prefix: string): string {
		return `${prefix}_${Date.now()}.pdf`;
	},
};

export default PdfService;
