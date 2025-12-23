import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { contactsStyles } from "@/styles/contacts";
import type { Product } from "@/types";
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

	const renderProductItem = ({ item }: { item: Product }) => (
		<ProductItem
			product={item}
			onPress={handleProductPress}
			onEdit={onEditProduct}
		/>
	);

	const renderEmptyState = () => (
		<View style={contactsStyles.emptyContainer}>
			<Text style={contactsStyles.emptyText}>No products found</Text>
		</View>
	);

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

	return (
		<FlatList
			style={contactsStyles.contactList}
			data={products}
			renderItem={renderProductItem}
			keyExtractor={(item) => String(item.id)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
			ListEmptyComponent={renderEmptyState}
			ListFooterComponent={<View style={contactsStyles.bottomSpacer} />}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
				autoscrollToTopThreshold: 10,
			}}
		/>
	);
}
