import type { Doc, Id } from "@/convex/_generated/dataModel";

// Type alias for Convex Invoice document
export type InvoiceDoc = Doc<"invoices">;

// Type alias for Convex Contact ID
export type ContactId = Id<"contacts">;

// Type alias for Convex Product ID
export type ProductId = Id<"products">;

// Type alias for Invoice ID
export type InvoiceId = Id<"invoices">;

// Invoice type for UI list view components
// Simplified type with formatted fields for display
export type InvoiceUI = {
	id: string; // Convex ID
	customerName: string;
	invoiceNumber: string;
	amount: string; // Formatted currency string for display
	total: string; // Formatted currency string for display
	date: string; // Formatted date string for display
	status: "unpaid" | "partial" | "paid";
	checked: boolean; // UI selection state for list view
};

// Customer type for invoice creation (simplified Contact representation)
export type Customer = {
	id: ContactId;
	name: string;
	phone: string;
	address: string;
	gstin?: string | null;
	dlNo?: string | null;
};

export type InvoiceStatus = "unpaid" | "partial" | "paid";
export type DiscountType = "percent" | "flat";

export interface Discount {
	value: number;
	type: DiscountType;
}

export interface InvoiceProduct {
	lineItemId?: string; // Line item ID for UI keys
	productId?: ProductId; // Reference to product (Convex ID)
	name: string;
	description: string;
	price: number; // Paise
	quantity: number;
	discount?: Discount;
}

export interface InvoiceSummary {
	subtotal: number; // Paise
	totalDiscount: number; // Paise
	tax: number; // Paise
	total: number; // Paise
}

// Type alias for invoice with items (same as InvoiceDoc since items are embedded)
export type InvoiceWithItems = InvoiceDoc;

// Type Guards for safe type narrowing

/**
 * Type guard for InvoiceStatus
 * Safely narrows a string to InvoiceStatus type
 */
export function isInvoiceStatus(value: string): value is InvoiceStatus {
	return ["unpaid", "partial", "paid"].includes(value);
}

/**
 * Type guard for DiscountType
 * Safely narrows a string to DiscountType type
 */
export function isDiscountType(value: string | null): value is DiscountType {
	return value === "percent" || value === "flat";
}
