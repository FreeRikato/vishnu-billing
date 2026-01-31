import { useEffect, useRef, useState } from "react";

/**
 * Generic hook for searching lists with debouncing.
 * Uses useRef to hold the latest filterFn to prevent unnecessary recalculations
 * when the filter function is not memoized by the caller.
 * @param items The full list of items.
 * @param filterFn A function that returns true if an item matches the query.
 * @param delay Debounce delay in ms (default 300).
 */
export function useSearch<T>(
	items: T[],
	filterFn: (item: T, query: string) => boolean,
	delay = 300,
) {
	const [searchText, setSearchText] = useState("");
	const [debouncedSearchText, setDebouncedSearchText] = useState("");

	// Store the latest filterFn in a ref to avoid triggering recalculation
	// when the function reference changes (e.g., not memoized)
	const filterFnRef = useRef(filterFn);
	filterFnRef.current = filterFn;

	// Debounce search text
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchText(searchText);
		}, delay);
		return () => clearTimeout(timer);
	}, [searchText, delay]);

	// Compute filtered items
	// We use filterFnRef.current to access the latest filter function
	// without including it in the dependency array
	const filteredItems = debouncedSearchText.trim()
		? items.filter((item) => filterFnRef.current(item, debouncedSearchText))
		: items;

	return {
		searchText,
		setSearchText,
		results: filteredItems,
	};
}
