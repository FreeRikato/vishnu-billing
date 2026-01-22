import type { Invoice } from "@/types";

export const mockInvoices: Invoice[] = [
	{
		id: 1,
		customerName: "John Doe",
		invoiceNumber: "Inv #1023",
		amount: "₹45,000.00",
		total: "₹45,000.00",
		date: "Oct 24, 2023",
		status: "paid",
		checked: false,
	},
	{
		id: 2,
		customerName: "Alice Smith",
		invoiceNumber: "Inv #1024",
		amount: "₹12,050.00",
		total: "₹12,050.00",
		date: "Oct 23, 2023",
		status: "unpaid",
		checked: false,
	},
	{
		id: 3,
		customerName: "Bob Johnson",
		invoiceNumber: "Inv #1021",
		amount: "₹89,000.00",
		total: "₹1,50,000.00",
		date: "Oct 20, 2023",
		status: "partial",
		checked: false,
	},
	{
		id: 4,
		customerName: "Charlie Davis",
		invoiceNumber: "Inv #1020",
		amount: "₹21,000.00",
		total: "₹21,000.00",
		date: "Oct 18, 2023",
		status: "paid",
		checked: false,
	},
];
