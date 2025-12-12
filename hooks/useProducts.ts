import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { getAllProducts, searchProducts } from "@/services/productService";
import type { Product } from "@/types";

export function useProducts() {
	const [searchText, setSearchText] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const loadProducts = useCallback(async () => {
		try {
			setLoading(true);
			const allProducts = await getAllProducts();
			setProducts(allProducts);
		} catch (error) {
			console.error("Error loading products:", error);
			Alert.alert("Error", "Failed to load products");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearchProducts = useCallback(async (query: string) => {
		try {
			setLoading(true);
			const searchResults = await searchProducts(query);
			setProducts(searchResults);
		} catch (error) {
			console.error("Error searching products:", error);
			Alert.alert("Error", "Failed to search products");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	useFocusEffect(
		useCallback(() => {
			loadProducts();
		}, [loadProducts]),
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (searchText.trim()) {
				handleSearchProducts(searchText);
			} else {
				loadProducts();
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchText, loadProducts, handleSearchProducts]);

	return {
		searchText,
		setSearchText,
		products,
		loading,
		loadProducts,
	};
}