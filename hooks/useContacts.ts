import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Contact, ContactUI } from "@/types/contact";
import { useSearch } from "./useSearch";
import { useSettings } from "./useSettings";

export function useContacts() {
	const { showArchivedContacts } = useSettings();
	const contacts =
		useQuery(api.contacts.list, {
			includeDeleted: showArchivedContacts,
		}) ?? [];
	const isLoading = contacts === undefined;

	// Map Convex contacts to UI format
	const contactsUI: ContactUI[] = contacts.map((contact: Contact) => ({
		...contact,
		id: contact._id,
	}));

	const filterContact = (contact: ContactUI, query: string) => {
		return (
			contact.name.toLowerCase().includes(query.toLowerCase()) ||
			contact.phone.includes(query)
		);
	};

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
