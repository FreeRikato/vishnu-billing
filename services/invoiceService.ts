import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { Invoice, InvoiceItem } from "@/db/schema";
import type { InvoiceProduct, InvoiceSummary } from "@/types/invoice";

export type CreateInvoiceInput = {
	invoiceNumber: string;
	customerId: number;
	customerName: string;
	customerPhone: string;
	items: InvoiceProduct[];
	summary: InvoiceSummary;
	date: string;
	pdfPath?: string;
};

export type InvoiceWithItems = {
	id: number;
	invoiceNumber: string;
	customerId: number;
	customerName: string;
	customerPhone: string;
	subtotal: number;
	totalDiscount: number;
	tax: number;
	total: number;
	date: string;
	status: string;
	pdfPath: string | null;
	items: InvoiceProduct[];
};

/**
 * Generate a unique invoice number
 * Uses full timestamp + random component to prevent collisions
 */
export function generateInvoiceNumber(): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0");
	return `INV-${timestamp}-${random}`;
}

/**
 * Get all invoices with their items
 */
export async function getAllInvoices(): Promise<InvoiceWithItems[]> {
	try {
		const invoices = await db.select().from(Invoice);

		const result: InvoiceWithItems[] = [];

		for (const invoice of invoices) {
			const items = await db
				.select()
				.from(InvoiceItem)
				.where(eq(InvoiceItem.invoiceId, invoice.id));

			result.push({
				...invoice,
				subtotal: Number(invoice.subtotal),
				totalDiscount: Number(invoice.totalDiscount),
				tax: Number(invoice.tax),
				total: Number(invoice.total),
				items: items.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					price: Number(item.price),
					quantity: item.quantity,
					discount:
						item.discountValue !== null && item.discountType !== null
							? {
									value: Number(item.discountValue),
									type: item.discountType as "percent" | "fixed",
								}
							: undefined,
				})),
			});
		}

		return result;
	} catch (error) {
		console.error("Error fetching invoices:", error);
		return [];
	}
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(
	id: number,
): Promise<InvoiceWithItems | null> {
	try {
		const invoices = await db.select().from(Invoice).where(eq(Invoice.id, id));

		if (invoices.length === 0) {
			return null;
		}

		const invoice = invoices[0];
		const items = await db
			.select()
			.from(InvoiceItem)
			.where(eq(InvoiceItem.invoiceId, invoice.id));

		return {
			...invoice,
			subtotal: Number(invoice.subtotal),
			totalDiscount: Number(invoice.totalDiscount),
			tax: Number(invoice.tax),
			total: Number(invoice.total),
			items: items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: Number(item.price),
				quantity: item.quantity,
				discount:
					item.discountValue !== null && item.discountType !== null
						? {
								value: Number(item.discountValue),
								type: item.discountType as "percent" | "fixed",
							}
						: undefined,
			})),
		};
	} catch (error) {
		console.error("Error fetching invoice by ID:", error);
		return null;
	}
}

/**
 * Create a new invoice with its items
 */
export async function createInvoice(
	input: CreateInvoiceInput,
): Promise<InvoiceWithItems | null> {
	try {
		// Create the invoice
		const invoiceResult = await db
			.insert(Invoice)
			.values({
				invoiceNumber: input.invoiceNumber,
				customerId: input.customerId,
				customerName: input.customerName,
				customerPhone: input.customerPhone,
				subtotal: input.summary.subtotal,
				totalDiscount: input.summary.totalDiscount,
				tax: input.summary.tax,
				total: input.summary.total,
				date: input.date,
				status: "unpaid",
				pdfPath: input.pdfPath ?? null,
			})
			.returning();

		const newInvoice = invoiceResult[0];
		if (!newInvoice) {
			return null;
		}

		// Create invoice items - preserve product reference for analytics
		const itemsToInsert = input.items.map((item) => ({
			invoiceId: newInvoice.id,
			productId: item.id, // Now directly using number ID
			name: item.name,
			description: item.description,
			price: item.price,
			quantity: item.quantity,
			discountValue: item.discount?.value ?? null,
			discountType: item.discount?.type ?? null,
		}));

		await db.insert(InvoiceItem).values(itemsToInsert);

		// Fetch the created items
		const createdItems = await db
			.select()
			.from(InvoiceItem)
			.where(eq(InvoiceItem.invoiceId, newInvoice.id));

		return {
			...newInvoice,
			subtotal: Number(newInvoice.subtotal),
			totalDiscount: Number(newInvoice.totalDiscount),
			tax: Number(newInvoice.tax),
			total: Number(newInvoice.total),
			items: createdItems.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: Number(item.price),
				quantity: item.quantity,
				discount:
					item.discountValue !== null && item.discountType !== null
						? {
								value: Number(item.discountValue),
								type: item.discountType as "percent" | "fixed",
							}
						: undefined,
			})),
		};
	} catch (error) {
		console.error("Error creating invoice:", error);
		return null;
	}
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
	id: number,
	status: "unpaid" | "partial" | "paid",
): Promise<boolean> {
	try {
		await db.update(Invoice).set({ status }).where(eq(Invoice.id, id));
		return true;
	} catch (error) {
		console.error("Error updating invoice status:", error);
		return false;
	}
}

/**
 * Update invoice PDF path
 */
export async function updateInvoicePdfPath(
	id: number,
	pdfPath: string,
): Promise<boolean> {
	try {
		await db.update(Invoice).set({ pdfPath }).where(eq(Invoice.id, id));
		return true;
	} catch (error) {
		console.error("Error updating invoice PDF path:", error);
		return false;
	}
}

/**
 * Delete an invoice and its items
 */
export async function deleteInvoice(id: number): Promise<boolean> {
	try {
		// Delete items first (foreign key constraint)
		await db.delete(InvoiceItem).where(eq(InvoiceItem.invoiceId, id));
		// Delete invoice
		await db.delete(Invoice).where(eq(Invoice.id, id));
		return true;
	} catch (error) {
		console.error("Error deleting invoice:", error);
		return false;
	}
}
