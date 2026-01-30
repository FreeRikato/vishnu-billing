import { useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearch } from "./useSearch";
import type { ProductUI } from "@/types/product";

export function useProducts() {
	const products = useQuery(api.products.list) ?? [];
	const isLoading = products === undefined;

	// Map Convex products to UI format
	const productsUI: ProductUI[] = products.map((product: any) => ({
		...product,
		id: product._id,
	}));

	const filterProduct = useCallback((product: ProductUI, query: string) => {
		return product.name.toLowerCase().includes(query.toLowerCase());
	}, []);

	const { searchText, setSearchText, results } = useSearch(
		productsUI,
		filterProduct,
	);

	return {
		searchText,
		setSearchText,
		products: results,
		loading: isLoading,
		createProduct: useMutation(api.products.create),
		updateProduct: useMutation(api.products.update),
		deleteProduct: useMutation(api.products.remove),
	};
}
