import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
import { ProductDeleteSection } from "@/components/product/ProductDeleteSection";
import { getProductById } from "@/services/productService";
import { useProductStore } from "@/store/productStore";
import type { Product } from "@/types";

export default function ProductDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();

	// State for product data and loading
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		unit: "",
	});

	// Load existing product data
	const loadProduct = useCallback(async () => {
		try {
			// Safely parse ID
			const idString = Array.isArray(id) ? id[0] : id;
			const productId = Number(idString);

			if (productId && !Number.isNaN(productId)) {
				const productData = await getProductById(productId);
				if (productData) {
					setProduct(productData);
					setFormData({
						name: productData.name,
						price: productData.price.toString(),
						unit: productData.unit,
					});
				} else {
					Alert.alert("Error", "Product not found");
					router.back();
				}
			} else {
				Alert.alert("Error", "Invalid product ID");
				router.back();
			}
		} catch (error) {
			console.error("Error loading product:", error);
			Alert.alert("Error", "Failed to load product");
			router.back();
		} finally {
			setLoading(false);
		}
	}, [id, router]);

	useEffect(() => {
		loadProduct();
	}, [loadProduct]);

	const handleSave = async () => {
		if (!product) return;

		if (!formData.name.trim()) {
			Alert.alert("Error", "Product name is required");
			return;
		}

		if (!formData.price.trim()) {
			Alert.alert("Error", "Price is required");
			return;
		}

		const priceValue = parseFloat(formData.price);
		if (Number.isNaN(priceValue) || priceValue < 0) {
			Alert.alert("Error", "Please enter a valid price");
			return;
		}

		if (!formData.unit.trim()) {
			Alert.alert("Error", "Unit is required");
			return;
		}

		try {
			// Use store method which wraps service and updates state
			const updatedProduct = await useProductStore
				.getState()
				.updateProduct(product.id, {
					name: formData.name,
					price: priceValue,
					unit: formData.unit,
				});

			if (updatedProduct) {
				Alert.alert("Success", "Product updated successfully");
				router.back();
			} else {
				Alert.alert("Error", "Failed to update product");
			}
		} catch (error) {
			console.error("Error updating product:", error);
			Alert.alert("Error", "Failed to update product");
		}
	};

	const handleCancel = () => {
		router.back();
	};

	const handleDelete = async () => {
		if (!product) return;

		Alert.alert(
			"Delete Product?",
			`Are you sure you want to delete ${product.name}? This cannot be undone.`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// Use store method which wraps service and updates state
							const result = await useProductStore
								.getState()
								.deleteProduct(product.id);
							if (result.success) {
								Alert.alert("Success", "Product deleted successfully");
								router.back();
							} else if (result.reason === "in_use") {
								Alert.alert(
									"Cannot Delete",
									"This product is used in one or more invoices. Please delete those invoices first.",
								);
							} else {
								Alert.alert("Error", "Failed to delete product");
							}
						} catch (error) {
							console.error("Error deleting product:", error);
							Alert.alert("Error", "Failed to delete product");
						}
					},
				},
			],
		);
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="Edit Product"
				onCancel={handleCancel}
				onSave={handleSave}
				isLoading={loading}
				loadingMessage="Loading product..."
			>
				<FormField
					label="Product Name"
					icon="inventory"
					required
					placeholder="e.g. Widget A"
					value={formData.name}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, name: text }))
					}
				/>

				<FormField
					label="Price"
					icon="attach-money"
					required
					placeholder="0.00"
					value={formData.price}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, price: text }))
					}
					keyboardType="decimal-pad"
				/>

				<FormField
					label="Unit"
					icon="straighten"
					required
					placeholder="e.g. kg, pcs, liters"
					value={formData.unit}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, unit: text }))
					}
				/>

				{/* Delete Button */}
				<ProductDeleteSection onDelete={handleDelete} />
			</ScreenLayout>
		</>
	);
}
