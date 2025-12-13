import { useRouter } from "expo-router";
import { Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

	const handleProductPress = (product: Product) => {
		Alert.alert(
			"Product Details",
			`Name: ${product.name}\nPrice: $${product.price.toFixed(2)}\nUnit: ${product.unit}`,
			[{ text: "OK", style: "default" }]
		);
	};

	const handleAddProduct = () => {
		router.push("/product/create");
	};

	return (
		<SafeAreaView style={contactsStyles.container} edges={["top", "left", "right"]}>
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
				onEditProduct={handleEditProduct}
				loading={loading}
			/>

			<FloatingAddActionButton onPress={handleAddProduct} small />
		</SafeAreaView>
	);
}
