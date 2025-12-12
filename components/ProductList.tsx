import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import type { Product } from "@/types";
import { contactsStyles } from "../styles/contacts";
import ProductItem from "./ProductItem";

interface ProductListProps {
	products: Product[];
	onPressProduct?: (product: Product) => void;
	onEditProduct?: (product: Product) => void;
	loading?: boolean;
}

export default function ProductList({
	products,
	onPressProduct,
	onEditProduct,
	loading = false,
}: ProductListProps) {
	const handleProductPress = (product: Product) => {
		onPressProduct?.(product);
	};

	if (loading) {
		return (
			<View style={contactsStyles.contactList}>
				<View style={contactsStyles.loadingContainer}>
					<ActivityIndicator size="large" color="#007AFF" />
					<Text style={contactsStyles.loadingText}>Loading products...</Text>
				</View>
			</View>
		);
	}

	if (products.length === 0) {
		return (
			<View style={contactsStyles.contactList}>
				<View style={contactsStyles.emptyContainer}>
					<Text style={contactsStyles.emptyText}>No products found</Text>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			style={contactsStyles.contactList}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
		>
			{products.map((product) => (
				<ProductItem
					key={product.id}
					product={product}
					onPress={handleProductPress}
					onEdit={onEditProduct}
				/>
			))}

			<View style={contactsStyles.bottomSpacer} />
		</ScrollView>
	);
}
