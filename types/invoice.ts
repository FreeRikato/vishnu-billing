export interface Invoice {
	id: string;
	customerName: string;
	invoiceNumber: string;
	amount: string;
	date: string;
	status: "unpaid" | "partial" | "paid";
	checked: boolean;
}
