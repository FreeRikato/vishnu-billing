import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
import { createProduct } from "@/services/productService";
import { useProductStore } from "@/store/productStore";

export default function CreateProductScreen() {
	const router = useRouter();

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		unit: "",
	});

	const handleSave = async () => {
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
			const newProduct = await createProduct({
				name: formData.name,
				price: priceValue,
				unit: formData.unit,
			});

			if (newProduct) {
				// Use efficient state update instead of refresh
				useProductStore.getState().addProduct(newProduct);
				Alert.alert("Success", "Product created successfully");
				router.back();
			} else {
				Alert.alert("Error", "Failed to create product");
			}
		} catch (error) {
			console.error("Error creating product:", error);
			Alert.alert("Error", "Failed to create product");
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="New Product"
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
			</ScreenLayout>
		</>
	);
}
