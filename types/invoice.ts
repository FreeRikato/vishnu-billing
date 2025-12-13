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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount?: number;
}

export interface InvoiceSummary {
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
}
