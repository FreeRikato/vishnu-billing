import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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
				keyExtractor={(item) => String(item.id)}
				renderItem={renderProductItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={invoiceStyles.productListContent}
			/>
		</BaseSelectionModal>
	);
}
