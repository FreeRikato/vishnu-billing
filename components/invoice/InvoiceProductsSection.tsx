import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import type { InvoiceProduct, Product } from "@/types";
import { scale } from "@/utils/responsive";
import { InvoiceProductCard } from "./InvoiceProductCard";

interface InvoiceProductsSectionProps {
	invoiceItems: InvoiceProduct[];
	availableProducts: Product[];
	onQuantityChange: (id: string, delta: number) => void;
	onRemoveProduct: (id: string) => void;
	onAddDiscount: (id: string) => void;
	onEditDiscount: (id: string) => void;
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
						key={product.lineItemId}
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
							<Ionicons name="add-circle" size={scale(28)} color="#13ec6a" />
						</View>
						<Text style={invoiceStyles.addProductText}>Add Product</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
