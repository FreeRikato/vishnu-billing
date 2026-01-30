export interface Invoice {
	id: string; // Convex ID
	customerName: string;
	invoiceNumber: string;
	amount: string;
	total: string;
	date: string;
	status: "unpaid" | "partial" | "paid";
	checked: boolean;
}

export interface Customer {
	id: string; // Convex ID (string)
	name: string;
	phone: string;
	address: string;
	gstin?: string | null;
	dlNo?: string | null;
}

export type InvoiceStatus = "unpaid" | "partial" | "paid";
export type DiscountType = "percent" | "flat";

export interface Discount {
	value: number;
	type: DiscountType;
}

export interface InvoiceProduct {
	id: string; // Product ID (now string for Convex)
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

// Type definition for invoice with items from database
export type InvoiceWithItems = {
	_id: string; // Convex ID
	_creationTime: number;
	invoiceNumber: string;
	customerId: string; // Convex ID (string)
	customerName: string;
	customerPhone: string;
	customerAddress: string;
	customerGstin?: string;
	customerDlNo?: string;
	subtotal: number; // Paise
	totalDiscount: number; // Paise
	tax: number; // Paise
	total: number; // Paise
	amountPaid: number; // Paise
	date: string;
	status: InvoiceStatus;
	pdfStorageId?: string;
	deletedAt?: string;
	items: InvoiceProduct[];
};

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
