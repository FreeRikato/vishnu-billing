import { useCallback } from "react";
import { useContactStore } from "@/store/contactStore";
import type { Contact } from "@/types";
import { useSearch } from "./useSearch";

/**
 * Hook for managing contact list UI state and search functionality.
 * Reads data from Zustand store instead of fetching on every navigation.
 * Provides debounced local search filtering for optimal UX.
 */
export function useContacts() {
	// Subscribe to store state for contacts and loading
	const contacts = useContactStore((state) => state.contacts);
	const loading = useContactStore((state) => state.loading);

	// Define how to filter a contact
	const filterContact = useCallback((contact: Contact, query: string) => {
		const lowerQuery = query.toLowerCase();
		return (
			contact.name.toLowerCase().includes(lowerQuery) ||
			contact.phone.includes(query)
		);
	}, []);

	const { searchText, setSearchText, results } = useSearch(
		contacts,
		filterContact,
	);

	return {
		searchText,
		setSearchText,
		contacts: results,
		loading,
	};
}
