import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
import { ProductDeleteSection } from "@/components/product/ProductDeleteSection";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { decimalToPaise, paiseToDecimal } from "@/utils/currency";

export default function ProductDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();

	// The ID from params is now a string (Convex ID)
	const productId = Array.isArray(id) ? id[0] : id;

	// Fetch product using Convex query
	const product = useQuery(
		api.products.get,
		productId ? { id: productId as Id<"products"> } : "skip",
	);
	const isLoading = product === undefined;

	// Mutations
	const updateProduct = useMutation(api.products.update);
	const deleteProduct = useMutation(api.products.remove);

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		unit: "",
	});

	// Update form data when product loads
	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				price: paiseToDecimal(product.price).toString(),
				unit: product.unit,
			});
		}
	}, [product]);

	const handleSave = async () => {
		if (!productId || !product) return;

		const priceValue = parseFloat(formData.price);

		if (!formData.name.trim()) {
			Alert.alert("Error", "Name is required");
			return;
		}

		if (Number.isNaN(priceValue) || priceValue < 0) {
			Alert.alert("Error", "Please enter a valid price");
			return;
		}

		if (!formData.unit.trim()) {
			Alert.alert("Error", "Unit is required");
			return;
		}

		try {
			// Convert rupees to paise before storing
			const priceInPaise = decimalToPaise(priceValue);

			const result = await updateProduct({
				id: productId as Id<"products">,
				name: formData.name,
				price: priceInPaise,
				unit: formData.unit,
			});

			if (result) {
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
		if (!productId || !product) return;

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
							const result = await deleteProduct({
								id: productId as Id<"products">,
							});
							if (result.success) {
								Alert.alert("Success", "Product deleted successfully");
								router.back();
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

	if (isLoading) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<ScreenLayout title="" onCancel={handleCancel}>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<View
							style={{
								width: 32,
								height: 32,
								borderRadius: 16,
								backgroundColor: "#13ec6a",
							}}
						/>
					</View>
				</ScreenLayout>
			</>
		);
	}

	if (!product) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<ScreenLayout title="" onCancel={handleCancel}>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<Text>Product not found</Text>
					</View>
				</ScreenLayout>
			</>
		);
	}

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="Edit Product"
				onCancel={handleCancel}
				onSave={handleSave}
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
					icon="currency-rupee"
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

				<ProductDeleteSection onDelete={handleDelete} />
			</ScreenLayout>
		</>
	);
}
