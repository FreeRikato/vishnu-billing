import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
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
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>What are they buying?</Text>
			<View style={invoiceStyles.productsSection}>
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
						style={invoiceStyles.addProductButton}
					>
						<View style={invoiceStyles.addProductIcon}>
							<Ionicons name="add-circle" size={28} color="#13ec6a" />
						</View>
						<Text style={invoiceStyles.addProductText}>Add Product</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
