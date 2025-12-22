import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSearch } from "../../hooks/useSearch";
import type { InvoiceProduct } from "../../types/invoice";
import { BaseSelectionModal } from "../common/BaseSelectionModal";

interface ProductPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onProductSelect: (product: InvoiceProduct) => void;
	products: InvoiceProduct[];
	selectedProductIds?: number[];
}

export function ProductPickerModal({
	visible,
	onClose,
	onProductSelect,
	products,
	selectedProductIds = [],
}: ProductPickerModalProps) {
	const [localSelectedIds, setLocalSelectedIds] = useState<Set<number>>(
		new Set(selectedProductIds),
	);

	// Sync local state when selectedProductIds prop changes
	useEffect(() => {
		setLocalSelectedIds(new Set(selectedProductIds));
	}, [selectedProductIds]);

	// Filter function for products
	const filterProduct = useCallback(
		(product: InvoiceProduct, query: string) =>
			product.name.toLowerCase().includes(query.toLowerCase()),
		[],
	);

	// Use debounced search hook
	const {
		searchText,
		setSearchText,
		results: filteredProducts,
	} = useSearch(products, filterProduct);

	const handleProductToggle = (product: InvoiceProduct) => {
		const newSelectedIds = new Set(localSelectedIds);

		if (newSelectedIds.has(product.id)) {
			newSelectedIds.delete(product.id);
		} else {
			newSelectedIds.add(product.id);
		}

		setLocalSelectedIds(newSelectedIds);
		onProductSelect(product);
	};

	const renderProductItem = ({ item }: { item: InvoiceProduct }) => {
		const isSelected = localSelectedIds.has(item.id);

		return (
			<View style={styles.productItem}>
				<Pressable
					style={({ pressed }) => [
						styles.productContent,
						pressed && styles.productContentPressed,
					]}
					onPress={() => handleProductToggle(item)}
				>
					<View style={styles.productInfo}>
						<Text style={styles.productName}>{item.name}</Text>
						<Text style={styles.productDescription}>{item.description}</Text>
					</View>
					<View style={styles.productRightSection}>
						<Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
						<TouchableOpacity
							style={[styles.addButton, isSelected && styles.addButtonSelected]}
							onPress={() => handleProductToggle(item)}
						>
							{isSelected ? (
								<View style={styles.addedButtonContent}>
									<Ionicons name="checkmark" size={16} color="#000000" />
									<Text style={styles.addedButtonText}>ADDED</Text>
								</View>
							) : (
								<Text style={styles.addButtonContent}>ADD</Text>
							)}
						</TouchableOpacity>
					</View>
				</Pressable>
			</View>
		);
	};

	return (
		<BaseSelectionModal
			visible={visible}
			title="Select Product"
			onClose={onClose}
			searchQuery={searchText}
			onSearchChange={setSearchText}
			searchPlaceholder="Search items..."
		>
			<FlatList
				data={filteredProducts}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderProductItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.productListContent}
			/>
		</BaseSelectionModal>
	);
}

const styles = StyleSheet.create({
	productItem: {
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	productContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 8,
		marginHorizontal: -8,
		borderRadius: 12,
	},
	productContentPressed: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#ffffff",
		lineHeight: 24,
	},
	productDescription: {
		fontSize: 16,
		fontWeight: "500",
		color: "#a1a1aa",
		marginTop: 4,
	},
	productRightSection: {
		flexDirection: "column",
		alignItems: "flex-end",
		gap: 8,
	},
	productPrice: {
		fontSize: 16,
		fontWeight: "500",
		color: "#a1a1aa",
	},
	addButton: {
		height: 44,
		minWidth: 96,
		borderRadius: 9999,
		borderWidth: 2,
		borderColor: "#13ec6a",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(19, 236, 106, 0.1)",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 3,
	},
	addButtonSelected: {
		backgroundColor: "#13ec6a",
		shadowColor: "rgba(19, 236, 106, 0.4)",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 15,
		elevation: 5,
	},
	addButtonContent: {
		fontSize: 14,
		fontWeight: "700",
		color: "#13ec6a",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	addedButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	addedButtonText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#000000",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	productListContent: {
		paddingHorizontal: 20,
		paddingBottom: 120,
	},
});
