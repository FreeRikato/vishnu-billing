import { create } from "zustand";
import {
	type CreateInvoiceInput,
	createInvoice,
	deleteInvoice,
	getAllInvoices,
	updateInvoiceStatus,
} from "@/services/invoiceService";

export type InvoiceWithItems = {
	id: number;
	invoiceNumber: string;
	customerId: number;
	customerName: string;
	customerPhone: string;
	subtotal: number;
	totalDiscount: number;
	tax: number;
	total: number;
	date: string;
	status: string;
	pdfPath: string | null;
	items: {
		id: number; // Invoice item ID
		name: string;
		description: string;
		price: number;
		quantity: number;
		discount?: { value: number; type: "percent" | "fixed" };
	}[];
};

interface InvoiceStore {
	invoices: InvoiceWithItems[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	addInvoice: (input: CreateInvoiceInput) => Promise<InvoiceWithItems | null>;
	updateStatus: (
		id: number,
		status: "unpaid" | "partial" | "paid",
	) => Promise<boolean>;
	deleteInvoice: (id: number) => Promise<boolean>;
	getInvoiceById: (id: number) => InvoiceWithItems | null;
}

/**
 * Zustand store for managing invoice state globally.
 * Provides centralized state management for invoices.
 */
export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
	invoices: [],
	loading: false,

	/**
	 * Fetches all invoices from the database and updates the store.
	 * Called on app initialization.
	 */
	fetchAll: async () => {
		set({ loading: true });
		try {
			const allInvoices = await getAllInvoices();
			set({ invoices: allInvoices, loading: false });
		} catch (error) {
			console.error("Error fetching invoices:", error);
			set({ loading: false });
		}
	},

	/**
	 * Refreshes invoice data by re-fetching from the database.
	 * Alias for fetchAll, used after create/update/delete operations.
	 */
	refresh: async () => {
		await get().fetchAll();
	},

	/**
	 * Creates a new invoice and adds it to the store.
	 * @param input - Invoice data
	 * @returns The created invoice or null if failed
	 */
	addInvoice: async (input: CreateInvoiceInput) => {
		try {
			const newInvoice = await createInvoice(input);
			if (newInvoice) {
				set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
			}
			return newInvoice;
		} catch (error) {
			console.error("Error adding invoice:", error);
			return null;
		}
	},

	/**
	 * Updates the status of an invoice.
	 * @param id - Invoice ID
	 * @param status - New status
	 * @returns true if successful, false otherwise
	 */
	updateStatus: async (id: number, status: "unpaid" | "partial" | "paid") => {
		try {
			const success = await updateInvoiceStatus(id, status);
			if (success) {
				set((state) => ({
					invoices: state.invoices.map((invoice) =>
						invoice.id === id ? { ...invoice, status } : invoice,
					),
				}));
			}
			return success;
		} catch (error) {
			console.error("Error updating invoice status:", error);
			return false;
		}
	},

	/**
	 * Deletes an invoice from the store and database.
	 * @param id - Invoice ID
	 * @returns true if successful, false otherwise
	 */
	deleteInvoice: async (id: number) => {
		try {
			const success = await deleteInvoice(id);
			if (success) {
				set((state) => ({
					invoices: state.invoices.filter((invoice) => invoice.id !== id),
				}));
			}
			return success;
		} catch (error) {
			console.error("Error deleting invoice:", error);
			return false;
		}
	},

	/**
	 * Gets an invoice by ID from the store.
	 * @param id - Invoice ID
	 * @returns The invoice or null if not found
	 */
	getInvoiceById: (id: number) => {
		const { invoices } = get();
		return invoices.find((invoice) => invoice.id === id) ?? null;
	},
}));
