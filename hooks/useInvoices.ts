import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/useSearch";
import type { Invoice } from "@/types";
import type { InvoiceDoc } from "@/types/invoice";
import { isInvoiceStatus } from "@/types/invoice";
import { formatCurrency } from "@/utils/currency";

export function useInvoices() {
	const storeInvoices = useQuery(api.invoices.list) ?? [];
	const isLoading = storeInvoices === undefined;
	const [selectionMode, setSelectionMode] = useState(false);

	// Convert Convex IDs to proper type and add checked state
	const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

	// Map of full Convex documents for sharing functionality
	const [invoicesMap, setInvoicesMap] = useState<Record<string, InvoiceDoc>>(
		{},
	);

	// Update map when store changes
	useEffect(() => {
		const map = storeInvoices.reduce(
			(acc, inv) => {
				acc[inv._id] = inv;
				return acc;
			},
			{} as Record<string, InvoiceDoc>,
		);
		setInvoicesMap(map);
	}, [storeInvoices]);

	const invoices: Invoice[] = storeInvoices.map((inv: InvoiceDoc) => {
		// For partial payments, show remaining amount
		const remainingAmount = inv.total - (inv.amountPaid || 0);
		const amountToDisplay =
			inv.status === "partial" ? remainingAmount : inv.total;

		return {
			id: inv._id,
			customerName: inv.customerName,
			invoiceNumber: inv.invoiceNumber,
			amount: formatCurrency(amountToDisplay),
			total: formatCurrency(inv.total),
			date: new Date(inv.date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			status: isInvoiceStatus(inv.status) ? inv.status : "unpaid",
			checked: checkedIds.has(inv._id),
		};
	});

	const toggleInvoice = (id: string) => {
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
		invoicesMap,
		loading: isLoading,
		selectionMode,
		searchText,
		setSearchText,
		toggleInvoice,
		enableSelectionMode,
		getSelectedCount,
		cancelSelection,
		updatePayment: useMutation(api.invoices.updatePayment),
		deleteInvoice: useMutation(api.invoices.remove),
	};
}
