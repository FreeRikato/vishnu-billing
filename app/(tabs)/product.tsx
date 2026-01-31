import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	FloatingAddActionButton,
	ProductHeader,
	ProductList,
	SearchBar,
} from "@/components";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { contactsStyles } from "../../styles/contacts";

export default function ProductScreen() {
	const { searchText, setSearchText, products, loading } = useProducts();
	const router = useRouter();

	const handleSettingsPress = () => {
		router.push("/settings");
	};

	const handleEditProduct = (product: Product) => {
		router.push(`/product/${product.id}`);
	};

	const handleProductPress = (product: Product) => {
		Alert.alert(
			"Product Details",
			`Name: ${product.name}\nPrice: ${formatCurrency(product.price)}\nUnit: ${product.unit}`,
			[{ text: "OK", style: "default" }],
		);
	};

	const handleAddProduct = () => {
		router.push("/product/create");
	};

	return (
		<SafeAreaView
			style={contactsStyles.container}
			edges={["top", "left", "right"]}
		>
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
