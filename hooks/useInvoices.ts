import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useInvoiceStore } from "@/store/invoiceStore";
import type { Invoice } from "@/types";

export function useInvoices() {
	const storeInvoices = useInvoiceStore((state) => state.invoices);
	const [selectionMode, setSelectionMode] = useState(false);

	// Convert store invoices to UI format with checked state
	const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

	const invoices: Invoice[] = storeInvoices.map((inv) => ({
		id: inv.id,
		customerName: inv.customerName,
		invoiceNumber: inv.invoiceNumber,
		amount: `$${inv.total.toFixed(2)}`,
		date: new Date(inv.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
		status: inv.status as "unpaid" | "partial" | "paid",
		checked: checkedIds.has(inv.id),
	}));

	const toggleInvoice = (id: number) => {
		setCheckedIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}

			// Check if all invoices are unselected
			if (newSet.size === 0) {
				setSelectionMode(false);
			}

			return newSet;
		});
	};

	const enableSelectionMode = () => {
		setSelectionMode(true);
	};

	const getSelectedCount = () => {
		return invoices.filter((invoice) => invoice.checked).length;
	};

	// Filter function for search
	const filterFn = (invoice: Invoice, query: string) =>
		invoice.customerName.toLowerCase().includes(query.toLowerCase()) ||
		invoice.date.toLowerCase().includes(query.toLowerCase()) ||
		invoice.invoiceNumber.toLowerCase().includes(query.toLowerCase());

	// Use debounced search hook
	const {
		searchText,
		setSearchText,
		results: filteredInvoices,
	} = useSearch(invoices, filterFn);

	const cancelSelection = () => {
		setCheckedIds(new Set());
		setSelectionMode(false);
	};

	return {
		invoices: filteredInvoices,
		selectionMode,
		searchText,
		setSearchText,
		toggleInvoice,
		enableSelectionMode,
		getSelectedCount,
		cancelSelection,
	};
}
