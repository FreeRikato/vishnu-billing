import { create } from "zustand";
import { getAllContacts } from "@/services/contactService";
import type { Contact } from "@/types";

interface ContactStore {
	contacts: Contact[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	search: (query: string) => Contact[];
	addContact: (contact: Contact) => void;
	updateContact: (id: number, contact: Contact) => void;
	deleteContact: (id: number) => void;
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
	 * Adds a single contact to the store efficiently without re-fetching from DB.
	 * Use this after creating a contact to avoid O(N) database reads.
	 */
	addContact: (contact: Contact) => {
		set((state) => ({ contacts: [...state.contacts, contact] }));
	},

	/**
	 * Updates a single contact in the store efficiently without re-fetching from DB.
	 * Use this after updating a contact to avoid O(N) database reads.
	 */
	updateContact: (id: number, updatedContact: Contact) => {
		set((state) => ({
			contacts: state.contacts.map((contact) =>
				contact.id === id ? updatedContact : contact,
			),
		}));
	},

	/**
	 * Deletes a single contact from the store efficiently without re-fetching from DB.
	 * Use this after deleting a contact to avoid O(N) database reads.
	 */
	deleteContact: (id: number) => {
		set((state) => ({
			contacts: state.contacts.filter((contact) => contact.id !== id),
		}));
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
