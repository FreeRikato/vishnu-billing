import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
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
				// Refresh the product store to reflect the new product
				await useProductStore.getState().refresh();
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
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerShown: false, // We'll use custom header
				}}
			/>

			{/* Custom Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
						<Text style={styles.cancelText}>Cancel</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>New Product</Text>
					<TouchableOpacity onPress={handleSave} style={styles.headerButton}>
						<Text style={styles.saveText}>Save</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Main Content */}
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Form Fields */}
				<View style={styles.formContainer}>
					{/* Name Field (Required) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="inventory" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Product Name</Text>
							<Text style={styles.required}>*</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="e.g. Widget A"
								value={formData.name}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, name: text }))
								}
								autoFocus
							/>
							<MaterialIcons
								name="edit"
								size={20}
								color="#13EC6A"
								style={styles.inputIcon}
							/>
						</View>
					</View>

					{/* Price Field (Required) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="attach-money" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Price</Text>
							<Text style={styles.required}>*</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="0.00"
								value={formData.price}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, price: text }))
								}
								keyboardType="decimal-pad"
							/>
						</View>
					</View>

					{/* Unit Field (Required) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="straighten" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Unit</Text>
							<Text style={styles.required}>*</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="e.g. kg, pcs, liters"
								value={formData.unit}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, unit: text }))
								}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000", // Pure black for OLED
	},
	header: {
		position: "sticky",
		top: 0,
		zIndex: 30,
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		height: 64,
	},
	headerButton: {
		minWidth: 60,
		alignItems: "center",
	},
	cancelText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#EF4444",
		letterSpacing: 0.5,
	},
	saveText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#13EC6A",
		letterSpacing: 0.5,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FFFFFF",
		letterSpacing: -0.5,
		textAlign: "center",
		flex: 1,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 128,
	},
	formContainer: {
		flex: 1,
	},
	fieldContainer: {
		marginBottom: 32,
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 12,
		paddingLeft: 8,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#9CA3AF",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	required: {
		fontSize: 24,
		color: "#13EC6A",
		position: "relative",
		top: -2,
	},
	inputContainer: {
		position: "relative",
	},
	input: {
		width: "100%",
		height: 72,
		backgroundColor: "#FFFFFF",
		borderWidth: 2,
		borderColor: "#E5E7EB",
		borderRadius: 16,
		paddingHorizontal: 24,
		fontSize: 20,
		color: "#000000",
		fontWeight: "500",
	},
	inputIcon: {
		position: "absolute",
		right: 24,
		top: "50%",
		marginTop: -10,
	},
});
