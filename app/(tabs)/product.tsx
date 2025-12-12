import { Alert, StatusBar, View } from "react-native";
import {
	FloatingAddActionButton,
	ProductHeader,
	ProductList,
	SearchBar,
} from "@/components";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import { contactsStyles } from "../../styles/contacts";

export default function ProductScreen() {
	const { searchText, setSearchText, products, loading } = useProducts();

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
