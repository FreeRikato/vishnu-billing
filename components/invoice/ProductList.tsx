import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles/invoice";
import type { InvoiceProduct } from "@/types/invoice";
import { scale } from "@/utils/responsive";
import { ProductItem } from "./ProductItem";

interface ProductListProps {
	products: InvoiceProduct[];
	onQuantityChange: (productId: string, change: number) => void;
	onRemoveProduct: (productId: string) => void;
	onAddDiscount: (productId: string) => void;
	onAddProduct: () => void;
}

export function ProductList({
	products,
	onQuantityChange,
	onRemoveProduct,
	onAddDiscount,
	onAddProduct,
}: ProductListProps) {
	return (
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>What are they buying?</Text>
			<View style={invoiceStyles.productsSection}>
				{products.map((product, index) => (
					<ProductItem
						key={product.lineItemId || `product-${index}`}
						product={product}
						onQuantityChange={onQuantityChange}
						onRemoveProduct={onRemoveProduct}
						onAddDiscount={onAddDiscount}
					/>
				))}
				<TouchableOpacity
					onPress={onAddProduct}
					style={invoiceStyles.addProductButton}
				>
					<View style={invoiceStyles.addProductIcon}>
						<Ionicons name="add-circle" size={scale(28)} color="#13ec6a" />
					</View>
					<Text style={invoiceStyles.addProductText}>Add Product</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
