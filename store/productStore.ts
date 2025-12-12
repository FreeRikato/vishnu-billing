import { create } from "zustand";
import { getAllProducts } from "@/services/productService";
import type { Product } from "@/types";

interface ProductStore {
	products: Product[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	search: (query: string) => Product[];
}

/**
 * Zustand store for managing product state globally.
 * Provides centralized state management for products, eliminating redundant fetches.
 */
export const useProductStore = create<ProductStore>((set, get) => ({
	products: [],
	loading: false,

	/**
	 * Fetches all products from the database and updates the store.
	 * Called on app initialization and after mutations.
	 */
	fetchAll: async () => {
		set({ loading: true });
		try {
			const allProducts = await getAllProducts();
			set({ products: allProducts, loading: false });
		} catch (error) {
			console.error("Error fetching products:", error);
			set({ loading: false });
		}
	},

	/**
	 * Refreshes product data by re-fetching from the database.
	 * Alias for fetchAll, used after create/update/delete operations.
	 */
	refresh: async () => {
		await get().fetchAll();
	},

	/**
	 * Searches products locally by filtering the store data.
	 * Provides fast client-side search without server round trips.
	 * @param query - Search query string
	 * @returns Filtered array of products matching the query
	 */
	search: (query: string) => {
		const { products } = get();
		if (!query.trim()) {
			return products;
		}
		const lowerQuery = query.toLowerCase();
		return products.filter((product) =>
			product.name.toLowerCase().includes(lowerQuery),
		);
	},
}));
