import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Invoice } from "@/types";
import type { InvoiceDoc } from "@/types/invoice";
import { isInvoiceStatus } from "@/types/invoice";
import { formatCurrency } from "@/utils/currency";
import { useSettings } from "./useSettings";

export function useInvoices() {
	const [searchText, setSearchText] = useState("");
	const { showArchivedInvoices } = useSettings();

	// Use server-side search when there's search text, otherwise use list
	const searchResults = useQuery(
		api.invoices.search,
		searchText.trim()
			? { query: searchText, includeDeleted: showArchivedInvoices }
			: "skip",
	);

	const storeInvoices =
		useQuery(api.invoices.list, {
			includeDeleted: showArchivedInvoices,
		}) ?? [];

	// Use search results when available, otherwise use all invoices
	const sourceInvoices = searchResults ?? storeInvoices;

	const isLoading = storeInvoices === undefined;
	const [selectionMode, setSelectionMode] = useState(false);

	// Convert Convex IDs to proper type and add checked state
	const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

	// Map of full Convex documents for sharing functionality
	const invoicesMap: Record<string, InvoiceDoc> = storeInvoices.reduce(
		(acc, inv) => {
			acc[inv._id] = inv;
			return acc;
		},
		{} as Record<string, InvoiceDoc>,
	);

	const invoices: Invoice[] = sourceInvoices.map((inv: InvoiceDoc) => {
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

	const cancelSelection = () => {
		setCheckedIds(new Set());
		setSelectionMode(false);
	};

	return {
		invoices,
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
