import { useCallback } from "react";
import { useProductStore } from "@/store/productStore";
import type { Product } from "@/types";
import { useSearch } from "./useSearch";

/**
 * Hook for managing product list UI state and search functionality.
 * Reads data from Zustand store instead of fetching on every navigation.
 * Provides debounced local search filtering for optimal UX.
 */
export function useProducts() {
	// Subscribe to store state for products and loading
	const products = useProductStore((state) => state.products);
	const loading = useProductStore((state) => state.loading);

	// Define how to filter a product
	const filterProduct = useCallback((product: Product, query: string) => {
		const lowerQuery = query.toLowerCase();
		return product.name.toLowerCase().includes(lowerQuery);
	}, []);

	const { searchText, setSearchText, results } = useSearch(
		products,
		filterProduct,
	);

	return {
		searchText,
		setSearchText,
		products: results,
		loading,
	};
}
