import { eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { Invoice, InvoiceItem } from "@/db/schema";
import { type InvoiceWithItems, isDiscountType } from "@/types/invoice";
import {
	type CreateInvoiceInput,
	CreateInvoiceSchema,
} from "@/utils/validation";

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
 * All currency values are returned in paise (integers)
 * Uses Drizzle relational query API to fetch invoices and items in a single query
 */
export async function getAllInvoices(): Promise<InvoiceWithItems[]> {
	try {
		// Use relational query API to fetch invoices with items in one query
		const invoices = await db.query.Invoice.findMany({
			where: isNull(Invoice.deletedAt),
			with: {
				items: true,
			},
		});

		return invoices.map((invoice) => ({
			...invoice,
			subtotal: invoice.subtotal, // Already in paise (integer)
			totalDiscount: invoice.totalDiscount, // Already in paise
			tax: invoice.tax, // Already in paise
			total: invoice.total, // Already in paise
			amountPaid: invoice.amountPaid, // Already in paise
			items: invoice.items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price, // Already in paise
				quantity: item.quantity,
				discount:
					item.discountValue !== null && isDiscountType(item.discountType)
						? {
								value: item.discountValue, // Already in paise/basis points
								type: item.discountType,
							}
						: undefined,
			})),
		}));
	} catch (error) {
		console.error("Error fetching invoices:", error);
		return [];
	}
}

/**
 * Get invoice by ID
 * All currency values are returned in paise (integers)
 * Uses Drizzle relational query API to fetch invoice with items in a single query
 */
export async function getInvoiceById(
	id: number,
): Promise<InvoiceWithItems | null> {
	try {
		// Use relational query API to fetch invoice with items in one query
		const invoice = await db.query.Invoice.findFirst({
			where: eq(Invoice.id, id),
			with: {
				items: true,
			},
		});

		if (!invoice) {
			return null;
		}

		return {
			...invoice,
			subtotal: invoice.subtotal, // Already in paise
			totalDiscount: invoice.totalDiscount, // Already in paise
			tax: invoice.tax, // Already in paise
			total: invoice.total, // Already in paise
			amountPaid: invoice.amountPaid, // Already in paise
			items: invoice.items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price, // Already in paise
				quantity: item.quantity,
				discount:
					item.discountValue !== null && isDiscountType(item.discountType)
						? {
								value: item.discountValue, // Already in paise/basis points
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
 * All currency values should be provided in paise (integers)
 * Validates input using Zod schema before insertion
 */
export async function createInvoice(
	input: CreateInvoiceInput,
): Promise<InvoiceWithItems | null> {
	try {
		// Validate input using Zod schema before proceeding
		const validationResult = CreateInvoiceSchema.safeParse(input);
		if (!validationResult.success) {
			console.error("Invalid invoice input:", validationResult.error.issues);
			return null;
		}

		// Create the invoice - values should already be in paise
		const invoiceResult = await db
			.insert(Invoice)
			.values({
				invoiceNumber: input.invoiceNumber,
				customerId: input.customerId,
				customerName: input.customerName,
				customerPhone: input.customerPhone,
				customerAddress: input.customerAddress,
				customerGstin: input.customerGstin ?? null,
				customerDlNo: input.customerDlNo ?? null,
				subtotal: input.summary.subtotal, // Already in paise
				totalDiscount: input.summary.totalDiscount, // Already in paise
				tax: input.summary.tax, // Already in paise
				total: input.summary.total, // Already in paise
				amountPaid: input.amountPaid ?? 0, // Already in paise
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
			price: item.price, // Already in paise
			quantity: item.quantity,
			discountValue: item.discount?.value ?? null, // Already in paise/basis points
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
			subtotal: newInvoice.subtotal, // Already in paise
			totalDiscount: newInvoice.totalDiscount, // Already in paise
			tax: newInvoice.tax, // Already in paise
			total: newInvoice.total, // Already in paise
			amountPaid: newInvoice.amountPaid, // Already in paise
			items: createdItems.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price, // Already in paise
				quantity: item.quantity,
				discount:
					item.discountValue !== null && isDiscountType(item.discountType)
						? {
								value: item.discountValue, // Already in paise/basis points
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
 * @param amountPaidInPaise - Payment amount in paise (integer)
 */
export async function updateInvoicePayment(
	id: number,
	amountPaidInPaise: number,
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
		const cleanAmountPaid = Math.max(0, amountPaidInPaise);

		// Determine new status (both values are in paise)
		let newStatus: "unpaid" | "partial" | "paid" = "unpaid";
		const totalInPaise = currentInvoice.total;

		// Direct integer comparison - no floating point issues
		if (cleanAmountPaid >= totalInPaise) {
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
