import { useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { mockProducts } from "@/assets";
import { ProductHeader, ProductList, SearchBar } from "@/components";
import { contactsStyles } from "@/styles";
import type { Product } from "@/types";

export default function ProductScreen() {
	const [searchText, setSearchText] = useState("");

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

	// Filter products based on search text
	const filteredProducts = mockProducts.filter((product) =>
		product.name.toLowerCase().includes(searchText.toLowerCase()),
	);

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
				products={filteredProducts}
				onPressProduct={handleProductPress}
			/>
		</View>
	);
}
