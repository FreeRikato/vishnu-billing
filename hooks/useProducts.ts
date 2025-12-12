import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/store/productStore";

/**
 * Hook for managing product list UI state and search functionality.
 * Reads data from Zustand store instead of fetching on every navigation.
 * Provides debounced local search filtering for optimal UX.
 */
export function useProducts() {
	const [searchText, setSearchText] = useState("");
	const [debouncedSearchText, setDebouncedSearchText] = useState("");

	// Subscribe to store state for products and loading
	const products = useProductStore((state) => state.products);
	const loading = useProductStore((state) => state.loading);

	// Debounce search text
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchText(searchText);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchText]);

	// Compute filtered products using useMemo
	// Filter locally to avoid dependency issues with store search function
	const filteredProducts = useMemo(() => {
		if (!debouncedSearchText.trim()) {
			return products;
		}
		const lowerQuery = debouncedSearchText.toLowerCase();
		return products.filter((product) =>
			product.name.toLowerCase().includes(lowerQuery),
		);
	}, [debouncedSearchText, products]);

	return {
		searchText,
		setSearchText,
		products: filteredProducts,
		loading,
	};
}
