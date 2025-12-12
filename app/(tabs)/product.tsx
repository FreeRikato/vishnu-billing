import { useRouter } from "expo-router";
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
	const router = useRouter();

	const handleSettingsPress = () => {
		Alert.alert("Settings", "Settings functionality coming soon!");
	};

	const handleEditProduct = (product: Product) => {
		router.push(`/product/${product.id}`);
	};

	const handleAddProduct = () => {
		router.push("/product/create");
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
				onEditProduct={handleEditProduct}
				loading={loading}
			/>

			<FloatingAddActionButton onPress={handleAddProduct} small />
		</View>
	);
}
