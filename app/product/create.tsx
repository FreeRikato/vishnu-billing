import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
import { useProducts } from "@/hooks/useProducts";
import { decimalToPaise } from "@/utils/currency";
import { validateProduct } from "@/utils/validation";

export default function CreateProductScreen() {
	const router = useRouter();
	const { createProduct } = useProducts();

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		unit: "",
	});

	const handleSave = async () => {
		// Parse price to number for validation
		const priceValue = parseFloat(formData.price);

		// Validate using Zod schema
		const validation = validateProduct({
			name: formData.name.trim(),
			price: priceValue,
			unit: formData.unit.trim(),
		});

		if (!validation.success) {
			Alert.alert("Error", validation.error);
			return;
		}

		try {
			// Convert rupees to paise before storing
			const priceInPaise = decimalToPaise(validation.data.price);

			// Use Convex mutation
			const result = await createProduct({
				name: validation.data.name,
				price: priceInPaise,
				unit: validation.data.unit,
			});

			if (result) {
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
			</ScreenLayout>
		</>
	);
}
