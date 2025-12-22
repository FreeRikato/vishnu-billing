import { create } from "zustand";
import {
	createContact as createContactService,
	deleteContact as deleteContactService,
	getAllContacts,
	updateContact as updateContactService,
} from "@/services/contactService";
import type { Contact } from "@/types";

interface ContactStore {
	contacts: Contact[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	search: (query: string) => Contact[];
	/**
	 * Creates a new contact by calling the service and updating the store.
	 * @param contact - Contact data without id, initials, color
	 * @returns The created contact or null if failed
	 */
	createContact: (
		contact: Omit<Contact, "id" | "initials" | "color">,
	) => Promise<Contact | null>;
	/**
	 * Updates a contact by calling the service and updating the store.
	 * @param id - Contact ID
	 * @param contact - Partial contact data to update
	 * @returns The updated contact or null if failed
	 */
	updateContact: (
		id: number,
		contact: Partial<Omit<Contact, "id">>,
	) => Promise<Contact | null>;
	/**
	 * Deletes a contact by calling the service and updating the store.
	 * @param id - Contact ID
	 * @returns Object with success status and optional reason for failure
	 */
	deleteContact: (
		id: number,
	) => Promise<
		| { success: true }
		| { success: false; reason: "has_invoices" | "unknown_error" }
	>;
}

/**
 * Zustand store for managing contact state globally.
 * Provides centralized state management for contacts, eliminating redundant fetches.
 */
export const useContactStore = create<ContactStore>((set, get) => ({
	contacts: [],
	loading: false,

	/**
	 * Fetches all contacts from the database and updates the store.
	 * Called on app initialization and after mutations.
	 */
	fetchAll: async () => {
		set({ loading: true });
		try {
			const allContacts = await getAllContacts();
			set({ contacts: allContacts, loading: false });
		} catch (error) {
			console.error("Error fetching contacts:", error);
			set({ loading: false });
		}
	},

	/**
	 * Refreshes contact data by re-fetching from the database.
	 * Alias for fetchAll, used after create/update/delete operations.
	 */
	refresh: async () => {
		await get().fetchAll();
	},

	/**
	 * Creates a new contact by calling the service and updating the store.
	 */
	createContact: async (
		contact: Omit<Contact, "id" | "initials" | "color">,
	) => {
		try {
			const newContact = await createContactService(contact);
			if (newContact) {
				set((state) => ({ contacts: [...state.contacts, newContact] }));
			}
			return newContact;
		} catch (error) {
			console.error("Error creating contact:", error);
			return null;
		}
	},

	/**
	 * Updates a contact by calling the service and updating the store.
	 */
	updateContact: async (id: number, contact: Partial<Omit<Contact, "id">>) => {
		try {
			const updatedContact = await updateContactService(id, contact);
			if (updatedContact) {
				set((state) => ({
					contacts: state.contacts.map((c) =>
						c.id === id ? updatedContact : c,
					),
				}));
			}
			return updatedContact;
		} catch (error) {
			console.error("Error updating contact:", error);
			return null;
		}
	},

	/**
	 * Deletes a contact by calling the service and updating the store.
	 * @returns Object with success status and optional reason for failure
	 */
	deleteContact: async (
		id: number,
	): Promise<
		| { success: true }
		| { success: false; reason: "has_invoices" | "unknown_error" }
	> => {
		try {
			const result = await deleteContactService(id);
			if (result.success) {
				set((state) => ({
					contacts: state.contacts.filter((contact) => contact.id !== id),
				}));
			}
			return result;
		} catch (error) {
			console.error("Error deleting contact:", error);
			return { success: false, reason: "unknown_error" };
		}
	},

	/**
	 * Searches contacts locally by filtering the store data.
	 * Provides fast client-side search without server round trips.
	 * @param query - Search query string
	 * @returns Filtered array of contacts matching the query
	 */
	search: (query: string) => {
		const { contacts } = get();
		if (!query.trim()) {
			return contacts;
		}
		const lowerQuery = query.toLowerCase();
		return contacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(lowerQuery) ||
				contact.phone.includes(query),
		);
	},
}));
