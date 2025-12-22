import { create } from "zustand";
import { getAllProducts } from "@/services/productService";
import type { Product } from "@/types";

interface ProductStore {
	products: Product[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	search: (query: string) => Product[];
	addProduct: (product: Product) => void;
	updateProduct: (id: number, product: Product) => void;
	deleteProduct: (id: number) => void;
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
	 * Adds a single product to the store efficiently without re-fetching from DB.
	 * Use this after creating a product to avoid O(N) database reads.
	 */
	addProduct: (product: Product) => {
		set((state) => ({ products: [...state.products, product] }));
	},

	/**
	 * Updates a single product in the store efficiently without re-fetching from DB.
	 * Use this after updating a product to avoid O(N) database reads.
	 */
	updateProduct: (id: number, updatedProduct: Product) => {
		set((state) => ({
			products: state.products.map((product) =>
				product.id === id ? updatedProduct : product,
			),
		}));
	},

	/**
	 * Deletes a single product from the store efficiently without re-fetching from DB.
	 * Use this after deleting a product to avoid O(N) database reads.
	 */
	deleteProduct: (id: number) => {
		set((state) => ({
			products: state.products.filter((product) => product.id !== id),
		}));
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
