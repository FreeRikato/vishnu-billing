import { useEffect, useMemo, useState } from "react";
import { useContactStore } from "@/store/contactStore";

/**
 * Hook for managing contact list UI state and search functionality.
 * Reads data from Zustand store instead of fetching on every navigation.
 * Provides debounced local search filtering for optimal UX.
 */
export function useContacts() {
	const [searchText, setSearchText] = useState("");
	const [debouncedSearchText, setDebouncedSearchText] = useState("");

	// Subscribe to store state for contacts and loading
	const contacts = useContactStore((state) => state.contacts);
	const loading = useContactStore((state) => state.loading);

	// Debounce search text
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchText(searchText);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchText]);

	// Compute filtered contacts using useMemo
	// Filter locally to avoid dependency issues with store search function
	const filteredContacts = useMemo(() => {
		if (!debouncedSearchText.trim()) {
			return contacts;
		}
		const lowerQuery = debouncedSearchText.toLowerCase();
		return contacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(lowerQuery) ||
				contact.phone.includes(debouncedSearchText),
		);
	}, [debouncedSearchText, contacts]);

	return {
		searchText,
		setSearchText,
		contacts: filteredContacts,
		loading,
	};
}
