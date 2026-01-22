export interface Invoice {
	id: number;
	customerName: string;
	invoiceNumber: string;
	amount: string;
	total: string;
	date: string;
	status: "unpaid" | "partial" | "paid";
	checked: boolean;
}

export interface Customer {
	id: number;
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
	id: number; // Product ID (number for consistency with DB)
	name: string;
	description: string;
	price: number;
	quantity: number;
	discount?: Discount;
}

export interface InvoiceSummary {
	subtotal: number;
	totalDiscount: number;
	tax: number;
	total: number;
}

// Type definition for invoice with items from database
export type InvoiceWithItems = {
	id: number;
	invoiceNumber: string;
	customerId: number;
	customerName: string;
	customerPhone: string;
	customerAddress: string;
	customerGstin: string | null;
	customerDlNo: string | null;
	subtotal: number;
	totalDiscount: number;
	tax: number;
	total: number;
	amountPaid: number;
	date: string;
	status: string;
	pdfPath: string | null;
	deletedAt: string | null;
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
