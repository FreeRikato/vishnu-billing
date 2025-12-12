import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { getAllContacts, searchContacts } from "@/services/contactService";
import type { Contact } from "@/types";

export function useContacts() {
	const [searchText, setSearchText] = useState("");
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);

	const loadContacts = useCallback(async () => {
		try {
			setLoading(true);
			const allContacts = await getAllContacts();
			setContacts(allContacts);
		} catch (error) {
			console.error("Error loading contacts:", error);
			Alert.alert("Error", "Failed to load contacts");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearchContacts = useCallback(async (query: string) => {
		try {
			setLoading(true);
			const searchResults = await searchContacts(query);
			setContacts(searchResults);
		} catch (error) {
			console.error("Error searching contacts:", error);
			Alert.alert("Error", "Failed to search contacts");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadContacts();
	}, [loadContacts]);

	useFocusEffect(
		useCallback(() => {
			loadContacts();
		}, [loadContacts]),
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (searchText.trim()) {
				handleSearchContacts(searchText);
			} else {
				loadContacts();
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchText, loadContacts, handleSearchContacts]);

	return {
		searchText,
		setSearchText,
		contacts,
		loading,
		loadContacts,
	};
}