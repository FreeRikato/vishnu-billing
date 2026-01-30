import { z } from "zod";

/**
 * Validation Schemas using Zod
 * Provides consistent form validation across the application
 */

// Contact Schema
export const ContactSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.min(10, "Phone number must be at least 10 digits")
		.max(15, "Phone number is too long"),
	address: z.string().min(1, "Address is required"),
	gstin: z.string().optional(),
	dlNo: z.string().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// Product Schema - using custom refinement for price validation
export const ProductSchema = z.object({
	name: z
		.string()
		.min(1, "Product name is required")
		.min(2, "Product name must be at least 2 characters")
		.max(100, "Product name must be less than 100 characters"),
	price: z
		.number({
			message: "Price is required",
		})
		.refine((val) => !Number.isNaN(val), {
			message: "Price must be a valid number",
		})
		.refine((val) => val >= 0, {
			message: "Price cannot be negative",
		})
		.refine((val) => val <= 999999.99, {
			message: "Price is too high",
		}),
	unit: z
		.string()
		.min(1, "Unit is required")
		.min(1, "Unit must be at least 1 character")
		.max(20, "Unit must be less than 20 characters"),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// Invoice Product Schema (for create invoice flow)
export const InvoiceProductSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	description: z.string(),
	price: z.number().min(0),
	quantity: z.number().min(1),
	discount: z
		.object({
			value: z.number().min(0),
			type: z.enum(["flat", "percent"]),
		})
		.optional(),
});

export type InvoiceProductInput = z.infer<typeof InvoiceProductSchema>;

// Customer Schema (for invoice creation)
export const CustomerSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

// Invoice Summary Schema (for create invoice flow)
export const InvoiceSummarySchema = z.object({
	subtotal: z.number().min(0),
	totalDiscount: z.number().min(0),
	tax: z.number().min(0),
	total: z.number().min(0),
});

export type InvoiceSummaryInput = z.infer<typeof InvoiceSummarySchema>;

// Create Invoice Schema (complete validation for invoice creation)
export const CreateInvoiceSchema = z.object({
	invoiceNumber: z.string().min(1, "Invoice number is required"),
	customerId: z.number().int().positive(),
	customerName: z.string().min(1, "Customer name is required"),
	customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
	customerAddress: z.string().min(1, "Address is required"),
	customerGstin: z.string().nullable().optional(),
	customerDlNo: z.string().nullable().optional(),
	items: z.array(InvoiceProductSchema).min(1, "At least one item is required"),
	summary: InvoiceSummarySchema,
	date: z.string().min(1, "Date is required"),
	amountPaid: z.number().min(0).optional(),
	pdfPath: z.string().optional(),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

// Helper function to validate Invoice form
function getFirstErrorMessage(error: z.ZodError): string {
	const firstIssue = error.issues[0];
	if (!firstIssue) {
		return "Validation failed";
	}
	// Handle different issue formats
	if (firstIssue.message) {
		return firstIssue.message;
	}
	return "Validation failed";
}

// Helper function to validate and return error message
export function getValidationError(
	schema: z.ZodSchema<unknown>,
	data: unknown,
): string | null {
	const result = schema.safeParse(data);
	if (!result.success) {
		return getFirstErrorMessage(result.error);
	}
	return null;
}

// Helper function to validate Contact form
export function validateContact(
	data: unknown,
): { success: true; data: ContactInput } | { success: false; error: string } {
	const result = ContactSchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: getFirstErrorMessage(result.error),
		};
	}
	return { success: true, data: result.data };
}

// Helper function to validate Product form
export function validateProduct(
	data: unknown,
): { success: true; data: ProductInput } | { success: false; error: string } {
	const result = ProductSchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: getFirstErrorMessage(result.error),
		};
	}
	return { success: true, data: result.data };
}

// Helper function to validate Invoice form
export function validateInvoice(
	data: unknown,
):
	| { success: true; data: CreateInvoiceInput }
	| { success: false; error: string } {
	const result = CreateInvoiceSchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: getFirstErrorMessage(result.error),
		};
	}
	return { success: true, data: result.data };
}
