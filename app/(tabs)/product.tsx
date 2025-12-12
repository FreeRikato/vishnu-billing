import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Alert, StatusBar, View } from "react-native";
import {
	FloatingAddActionButton,
	ProductHeader,
	ProductList,
	SearchBar,
} from "@/components";
import { ProductService } from "@/services/productService";
import type { Product } from "@/types";
import { contactsStyles } from "../../styles/contacts";

export default function ProductScreen() {
	const [searchText, setSearchText] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const loadProducts = useCallback(async () => {
		try {
			setLoading(true);
			const allProducts = await ProductService.getAllProducts();
			setProducts(allProducts);
		} catch (error) {
			console.error('Error loading products:', error);
			Alert.alert("Error", "Failed to load products");
		} finally {
			setLoading(false);
		}
	}, []);

	const searchProducts = useCallback(async (query: string) => {
		try {
			setLoading(true);
			const searchResults = await ProductService.searchProducts(query);
			setProducts(searchResults);
		} catch (error) {
			console.error('Error searching products:', error);
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
		}, [loadProducts])
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (searchText.trim()) {
				searchProducts(searchText);
			} else {
				loadProducts();
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchText, loadProducts, searchProducts]);

	const handleSettingsPress = () => {
		Alert.alert("Settings", "Settings functionality coming soon!");
	};

	const handleProductPress = (product: Product) => {
		Alert.alert(
			product.name,
			`Price: $${product.price.toFixed(2)}\nUnit: ${product.unit}`,
			[{ text: "OK", style: "default" }],
		);
	};

	const handleAddProduct = () => {
		Alert.alert("Add Product", "Add product functionality coming soon!");
	};

	return (
		<View style={contactsStyles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#000000" />

			<ProductHeader onSettingsPress={handleSettingsPress} />

			<SearchBar
				value={searchText}
				onChangeText={setSearchText}
				placeholder="Search Products..."
			/>

			<ProductList
				products={products}
				onPressProduct={handleProductPress}
				loading={loading}
			/>

			<FloatingAddActionButton onPress={handleAddProduct} small />
		</View>
	);
}
