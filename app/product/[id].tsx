import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	deleteProduct,
	getProductById,
	updateProduct,
} from "@/services/productService";
import { useProductStore } from "@/store/productStore";
import type { Product } from "@/types";

export default function ProductDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

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
			const productId = parseInt(id || "0", 10);
			if (productId > 0) {
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
			const updatedProduct = await updateProduct(product.id, {
				name: formData.name,
				price: priceValue,
				unit: formData.unit,
			});

			if (updatedProduct) {
				// Refresh the product store to reflect the updated product
				await useProductStore.getState().refresh();
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
							const success = await deleteProduct(product.id);
							if (success) {
								// Refresh the product store to reflect the deleted product
								await useProductStore.getState().refresh();
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

	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer} edges={["top", "left", "right"]}>
				<ActivityIndicator size="large" color="#13EC6A" />
				<Text style={styles.loadingText}>Loading product...</Text>
			</SafeAreaView>
		);
	}

	if (!product) {
		return (
			<SafeAreaView style={styles.errorContainer} edges={["top", "left", "right"]}>
				<Text style={styles.errorText}>Product not found</Text>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
					<Text style={styles.headerTitle}>Edit Product</Text>
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

					{/* Delete Button */}
					<View style={styles.deleteSection}>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={handleDelete}
						>
							<MaterialIcons name="delete-forever" size={24} color="#EF4444" />
							<Text style={styles.deleteButtonText}>Delete Product</Text>
						</TouchableOpacity>
						<Text style={styles.deleteWarning}>
							This action cannot be undone.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
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
		backgroundColor: "#1A1A1A",
		borderWidth: 2,
		borderColor: "#333333",
		borderRadius: 16,
		paddingHorizontal: 24,
		fontSize: 20,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	inputIcon: {
		position: "absolute",
		right: 24,
		top: "50%",
		marginTop: -10,
	},
	deleteSection: {
		paddingTop: 32,
		paddingBottom: 16,
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 20,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "rgba(239, 68, 68, 0.3)",
		backgroundColor: "rgba(239, 68, 68, 0.05)",
		marginBottom: 16,
	},
	deleteButtonText: {
		color: "#EF4444",
		fontSize: 20,
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	deleteWarning: {
		textAlign: "center",
		color: "#6B7280",
		fontSize: 14,
		fontWeight: "500",
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	loadingText: {
		fontSize: 18,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	errorContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
		paddingHorizontal: 40,
	},
	errorText: {
		fontSize: 20,
		color: "#FFFFFF",
		fontWeight: "bold",
		textAlign: "center",
	},
	backButton: {
		backgroundColor: "#13EC6A",
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 25,
	},
	backButtonText: {
		color: "#000000",
		fontSize: 16,
		fontWeight: "bold",
	},
});
