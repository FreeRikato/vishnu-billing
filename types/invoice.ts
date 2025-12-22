export interface Invoice {
	id: number;
	customerName: string;
	invoiceNumber: string;
	amount: string;
	date: string;
	status: "unpaid" | "partial" | "paid";
	checked: boolean;
}

export interface Customer {
	id: number;
	name: string;
}

export type DiscountType = "percent" | "fixed";

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
