import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Product, ProductUI } from "@/types/product";
import { useSearch } from "./useSearch";
import { useSettings } from "./useSettings";

export function useProducts() {
	const { showArchivedProducts } = useSettings();
	const products =
		useQuery(api.products.list, {
			includeDeleted: showArchivedProducts,
		}) ?? [];
	const isLoading = products === undefined;

	// Map Convex products to UI format
	const productsUI: ProductUI[] = products.map((product: Product) => ({
		...product,
		id: product._id,
	}));

	const filterProduct = (product: ProductUI, query: string) => {
		return product.name.toLowerCase().includes(query.toLowerCase());
	};

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
