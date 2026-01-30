import { useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearch } from "./useSearch";
import type { ContactUI } from "@/types/contact";

export function useContacts() {
	const contacts = useQuery(api.contacts.list) ?? [];
	const isLoading = contacts === undefined;

	// Map Convex contacts to UI format
	const contactsUI: ContactUI[] = contacts.map((contact: any) => ({
		...contact,
		id: contact._id,
	}));

	const filterContact = useCallback(
		(contact: ContactUI, query: string) => {
			return (
				contact.name.toLowerCase().includes(query.toLowerCase()) ||
				contact.phone.includes(query)
			);
		},
		[],
	);

	const { searchText, setSearchText, results } = useSearch(
		contactsUI,
		filterContact,
	);

	return {
		searchText,
		setSearchText,
		contacts: results,
		loading: isLoading,
		createContact: useMutation(api.contacts.create),
		updateContact: useMutation(api.contacts.update),
		deleteContact: useMutation(api.contacts.remove),
	};
}
