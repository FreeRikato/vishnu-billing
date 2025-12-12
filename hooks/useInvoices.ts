import { useState } from "react";
import { mockInvoices } from "@/assets";
import type { Invoice } from "@/types";

export function useInvoices() {
	const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
	const [selectionMode, setSelectionMode] = useState(false);
	const [searchText, setSearchText] = useState("");

	const toggleInvoice = (id: string) => {
		setInvoices((prev) => {
			const updated = prev.map((invoice) =>
				invoice.id === id ? { ...invoice, checked: !invoice.checked } : invoice,
			);

			// Check if all invoices are unselected
			const hasAnySelected = updated.some((invoice) => invoice.checked);
			if (!hasAnySelected) {
				setSelectionMode(false);
			}

			return updated;
		});
	};

	const enableSelectionMode = () => {
		setSelectionMode(true);
	};

	const getSelectedCount = () => {
		return invoices.filter((invoice) => invoice.checked).length;
	};

	const filteredInvoices = invoices.filter(
		(invoice) =>
			invoice.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
			invoice.date.toLowerCase().includes(searchText.toLowerCase()) ||
			invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()),
	);

	return {
		invoices: filteredInvoices,
		selectionMode,
		searchText,
		setSearchText,
		toggleInvoice,
		enableSelectionMode,
		getSelectedCount,
	};
}
