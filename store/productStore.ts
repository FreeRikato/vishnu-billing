import { create } from "zustand";
import {
	createProduct as createProductService,
	deleteProduct as deleteProductService,
	getAllProducts,
	updateProduct as updateProductService,
} from "@/services/productService";
import type { Product } from "@/types";

interface ProductStore {
	products: Product[];
	loading: boolean;
	fetchAll: () => Promise<void>;
	refresh: () => Promise<void>;
	search: (query: string) => Product[];
	/**
	 * Creates a new product by calling the service and updating the store.
	 * @param product - Product data without id
	 * @returns The created product or null if failed
	 */
	createProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
	/**
	 * Updates a product by calling the service and updating the store.
	 * @param id - Product ID
	 * @param product - Partial product data to update
	 * @returns The updated product or null if failed
	 */
	updateProduct: (
		id: number,
		product: Partial<Omit<Product, "id">>,
	) => Promise<Product | null>;
	/**
	 * Deletes a product by calling the service and updating the store.
	 * @param id - Product ID
	 * @returns true if successful, false otherwise
	 */
	deleteProduct: (id: number) => Promise<boolean>;
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
	 * Creates a new product by calling the service and updating the store.
	 */
	createProduct: async (product: Omit<Product, "id">) => {
		try {
			const newProduct = await createProductService(product);
			if (newProduct) {
				set((state) => ({ products: [...state.products, newProduct] }));
			}
			return newProduct;
		} catch (error) {
			console.error("Error creating product:", error);
			return null;
		}
	},

	/**
	 * Updates a product by calling the service and updating the store.
	 */
	updateProduct: async (id: number, product: Partial<Omit<Product, "id">>) => {
		try {
			const updatedProduct = await updateProductService(id, product);
			if (updatedProduct) {
				set((state) => ({
					products: state.products.map((p) =>
						p.id === id ? updatedProduct : p,
					),
				}));
			}
			return updatedProduct;
		} catch (error) {
			console.error("Error updating product:", error);
			return null;
		}
	},

	/**
	 * Deletes a product by calling the service and updating the store.
	 */
	deleteProduct: async (id: number) => {
		try {
			const success = await deleteProductService(id);
			if (success) {
				set((state) => ({
					products: state.products.filter((product) => product.id !== id),
				}));
			}
			return success;
		} catch (error) {
			console.error("Error deleting product:", error);
			return false;
		}
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
