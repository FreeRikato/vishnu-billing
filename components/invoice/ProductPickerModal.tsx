import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { invoiceStyles } from "@/styles";
import { formatCurrency } from "@/utils/currency";
import { scale } from "@/utils/responsive";
import { useSearch } from "../../hooks/useSearch";
import type { InvoiceProduct } from "../../types/invoice";
import { BaseSelectionModal } from "../common/BaseSelectionModal";

interface ProductPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onProductSelect: (product: InvoiceProduct) => void;
	products: InvoiceProduct[];
	selectedProductIds?: string[];
}

export function ProductPickerModal({
	visible,
	onClose,
	onProductSelect,
	products,
	selectedProductIds = [],
}: ProductPickerModalProps) {
	const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
		new Set(selectedProductIds),
	);

	// Sync local state when selectedProductIds prop changes
	useEffect(() => {
		setLocalSelectedIds(new Set(selectedProductIds));
	}, [selectedProductIds]);

	// Filter function for products
	const filterProduct = (product: InvoiceProduct, query: string) =>
		product.name.toLowerCase().includes(query.toLowerCase());

	// Use debounced search hook
	const {
		searchText,
		setSearchText,
		results: filteredProducts,
	} = useSearch(products, filterProduct);

	const handleProductToggle = (product: InvoiceProduct) => {
		if (!product.lineItemId) return; // Skip if no id

		const newSelectedIds = new Set(localSelectedIds);

		if (newSelectedIds.has(product.lineItemId)) {
			newSelectedIds.delete(product.lineItemId);
		} else {
			newSelectedIds.add(product.lineItemId);
		}

		setLocalSelectedIds(newSelectedIds);
		onProductSelect(product);
	};

	const renderProductItem = ({ item }: { item: InvoiceProduct }) => {
		const isSelected = item.lineItemId
			? localSelectedIds.has(item.lineItemId)
			: false;

		return (
			<View style={invoiceStyles.productItem}>
				<Pressable
					style={({ pressed }) => [
						invoiceStyles.productContent,
						pressed && invoiceStyles.productContentPressed,
					]}
					onPress={() => handleProductToggle(item)}
				>
					<View style={invoiceStyles.productInfo}>
						<Text style={invoiceStyles.productName}>{item.name}</Text>
						<Text style={invoiceStyles.productDescription}>
							{item.description}
						</Text>
					</View>
					<View style={invoiceStyles.productRightSection}>
						<Text style={invoiceStyles.productPrice}>
							{formatCurrency(item.price)}
						</Text>
						<TouchableOpacity
							style={[
								invoiceStyles.addButton,
								isSelected && invoiceStyles.addButtonSelected,
							]}
							onPress={() => handleProductToggle(item)}
						>
							{isSelected ? (
								<View style={invoiceStyles.addedButtonContent}>
									<Ionicons name="checkmark" size={scale(16)} color="#000000" />
									<Text style={invoiceStyles.addedButtonText}>ADDED</Text>
								</View>
							) : (
								<Text style={invoiceStyles.addButtonContent}>ADD</Text>
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
				keyExtractor={(item, index) => item.lineItemId || `product-${index}`}
				renderItem={renderProductItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={invoiceStyles.productListContent}
			/>
		</BaseSelectionModal>
	);
}
