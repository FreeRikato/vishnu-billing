export interface Invoice {
	id: string;
	customerName: string;
	invoiceNumber: string;
	amount: string;
	date: string;
	status: "unpaid" | "partial" | "paid";
	checked: boolean;
}

export interface Customer {
	id: string;
	name: string;
}

export type DiscountType = "percent" | "fixed";

export interface Discount {
	value: number;
	type: DiscountType;
}

export interface InvoiceProduct {
	id: string;
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
