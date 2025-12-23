import { eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { Invoice, InvoiceItem } from "@/db/schema";
import {
	type InvoiceProduct,
	type InvoiceSummary,
	type InvoiceWithItems,
	isDiscountType,
} from "@/types/invoice";

export type CreateInvoiceInput = {
	invoiceNumber: string;
	customerId: number;
	customerName: string;
	customerPhone: string;
	items: InvoiceProduct[];
	summary: InvoiceSummary;
	date: string;
	amountPaid?: number;
	pdfPath?: string;
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
 * All currency values are returned in cents (integers)
 */
export async function getAllInvoices(): Promise<InvoiceWithItems[]> {
	try {
		const invoices = await db
			.select()
			.from(Invoice)
			.where(isNull(Invoice.deletedAt));

		const result: InvoiceWithItems[] = [];

		for (const invoice of invoices) {
			const items = await db
				.select()
				.from(InvoiceItem)
				.where(eq(InvoiceItem.invoiceId, invoice.id));

			result.push({
				...invoice,
				subtotal: invoice.subtotal, // Already in cents (integer)
				totalDiscount: invoice.totalDiscount, // Already in cents
				tax: invoice.tax, // Already in cents
				total: invoice.total, // Already in cents
				amountPaid: invoice.amountPaid, // Already in cents
				items: items.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					price: item.price, // Already in cents
					quantity: item.quantity,
					discount:
						item.discountValue !== null && isDiscountType(item.discountType)
							? {
									value: item.discountValue, // Already in cents/basis points
									type: item.discountType,
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
 * All currency values are returned in cents (integers)
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
			subtotal: invoice.subtotal, // Already in cents
			totalDiscount: invoice.totalDiscount, // Already in cents
			tax: invoice.tax, // Already in cents
			total: invoice.total, // Already in cents
			amountPaid: invoice.amountPaid, // Already in cents
			items: items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price, // Already in cents
				quantity: item.quantity,
				discount:
					item.discountValue !== null && isDiscountType(item.discountType)
						? {
								value: item.discountValue, // Already in cents/basis points
								type: item.discountType,
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
 * All currency values should be provided in cents (integers)
 */
export async function createInvoice(
	input: CreateInvoiceInput,
): Promise<InvoiceWithItems | null> {
	try {
		// Create the invoice - values should already be in cents
		const invoiceResult = await db
			.insert(Invoice)
			.values({
				invoiceNumber: input.invoiceNumber,
				customerId: input.customerId,
				customerName: input.customerName,
				customerPhone: input.customerPhone,
				subtotal: input.summary.subtotal, // Already in cents
				totalDiscount: input.summary.totalDiscount, // Already in cents
				tax: input.summary.tax, // Already in cents
				total: input.summary.total, // Already in cents
				amountPaid: input.amountPaid ?? 0, // Already in cents
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
			productId: item.id,
			name: item.name,
			description: item.description,
			price: item.price, // Already in cents
			quantity: item.quantity,
			discountValue: item.discount?.value ?? null, // Already in cents/basis points
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
			subtotal: newInvoice.subtotal, // Already in cents
			totalDiscount: newInvoice.totalDiscount, // Already in cents
			tax: newInvoice.tax, // Already in cents
			total: newInvoice.total, // Already in cents
			amountPaid: newInvoice.amountPaid, // Already in cents
			items: createdItems.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price, // Already in cents
				quantity: item.quantity,
				discount:
					item.discountValue !== null && isDiscountType(item.discountType)
						? {
								value: item.discountValue, // Already in cents/basis points
								type: item.discountType,
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
 * Delete an invoice using soft delete (sets deletedAt timestamp)
 */
export async function deleteInvoice(id: number): Promise<boolean> {
	try {
		// Soft delete by setting deletedAt to current timestamp
		const deletedAt = new Date().toISOString();
		await db.update(Invoice).set({ deletedAt }).where(eq(Invoice.id, id));
		return true;
	} catch (error) {
		console.error("Error deleting invoice:", error);
		return false;
	}
}

/**
 * Update invoice payment and automatically calculate status
 * @param id - Invoice ID
 * @param amountPaidInCents - Payment amount in cents (integer)
 */
export async function updateInvoicePayment(
	id: number,
	amountPaidInCents: number,
): Promise<{
	success: boolean;
	newStatus?: "unpaid" | "partial" | "paid";
	newAmountPaid?: number;
}> {
	try {
		// First get the invoice to know the total
		const currentInvoice = await getInvoiceById(id);
		if (!currentInvoice) return { success: false };

		// Ensure amountPaid is not negative
		const cleanAmountPaid = Math.max(0, amountPaidInCents);

		// Determine new status (both values are in cents)
		let newStatus: "unpaid" | "partial" | "paid" = "unpaid";
		const totalInCents = currentInvoice.total;

		// Direct integer comparison - no floating point issues
		if (cleanAmountPaid >= totalInCents) {
			newStatus = "paid";
		} else if (cleanAmountPaid > 0) {
			newStatus = "partial";
		} else {
			newStatus = "unpaid";
		}

		// Perform Update
		await db
			.update(Invoice)
			.set({
				amountPaid: cleanAmountPaid,
				status: newStatus,
			})
			.where(eq(Invoice.id, id));

		return { success: true, newStatus, newAmountPaid: cleanAmountPaid };
	} catch (error) {
		console.error("Error updating invoice payment:", error);
		return { success: false };
	}
}
