import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { InvoiceProduct, Product } from "@/types";
import { InvoiceProductCard } from "./InvoiceProductCard";

interface InvoiceProductsSectionProps {
	invoiceItems: InvoiceProduct[];
	availableProducts: Product[];
	onQuantityChange: (id: number, delta: number) => void;
	onRemoveProduct: (id: number) => void;
	onAddDiscount: (id: number) => void;
	onEditDiscount: (id: number) => void;
	onAddProduct: () => void;
}

export function InvoiceProductsSection({
	invoiceItems,
	availableProducts,
	onQuantityChange,
	onRemoveProduct,
	onAddDiscount,
	onEditDiscount,
	onAddProduct,
}: InvoiceProductsSectionProps) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>What are they buying?</Text>
			<View style={styles.productsSection}>
				{invoiceItems.map((product) => (
					<InvoiceProductCard
						key={product.id}
						product={product}
						onQuantityChange={onQuantityChange}
						onRemove={onRemoveProduct}
						onAddDiscount={onAddDiscount}
						onEditDiscount={onEditDiscount}
					/>
				))}
				{availableProducts.length > 0 && (
					<TouchableOpacity
						onPress={onAddProduct}
						style={styles.addProductButton}
					>
						<View style={styles.addProductIcon}>
							<Ionicons name="add-circle" size={28} color="#13ec6a" />
						</View>
						<Text style={styles.addProductText}>Add Product</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 24,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	productsSection: {
		gap: 16,
	},
	addProductButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		minHeight: 72,
		borderWidth: 2,
		borderColor: "rgba(19, 236, 106, 0.5)",
		borderStyle: "dashed",
		borderRadius: 12,
		backgroundColor: "rgba(19, 236, 106, 0.1)",
		paddingVertical: 16,
		marginTop: 8,
	},
	addProductIcon: {
		backgroundColor: "rgba(19, 236, 106, 0.2)",
		borderRadius: 24,
		padding: 4,
	},
	addProductText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#13ec6a",
	},
});
