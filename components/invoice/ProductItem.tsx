import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles/invoice";
import type { InvoiceProduct } from "@/types/invoice";

interface ProductItemProps {
	product: InvoiceProduct;
	onQuantityChange: (productId: number, change: number) => void;
	onRemoveProduct: (productId: number) => void;
	onAddDiscount: (productId: number) => void;
}

export function ProductItem({
	product,
	onQuantityChange,
	onRemoveProduct,
	onAddDiscount,
}: ProductItemProps) {
	return (
		<View style={invoiceStyles.productCard}>
			<View style={invoiceStyles.productHeader}>
				<View style={invoiceStyles.productInfo}>
					<Text style={invoiceStyles.productName}>{product.name}</Text>
					<Text style={invoiceStyles.productDescription}>
						{product.description}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => onRemoveProduct(product.id)}
					style={invoiceStyles.removeButton}
				>
					<AntDesign name="close-circle" size={20} color="#9ca3af" />
				</TouchableOpacity>
			</View>
			<View style={invoiceStyles.productFooter}>
				<Text style={invoiceStyles.productPrice}>
					${product.price.toFixed(2)}
				</Text>
				<View style={invoiceStyles.stepper}>
					<TouchableOpacity
						onPress={() => onQuantityChange(product.id, -1)}
						style={invoiceStyles.stepperButton}
					>
						<Ionicons name="remove-circle" size={20} />
					</TouchableOpacity>
					<Text style={invoiceStyles.stepperValue}>{product.quantity}</Text>
					<TouchableOpacity
						onPress={() => onQuantityChange(product.id, 1)}
						style={invoiceStyles.stepperButtonPrimary}
					>
						<Ionicons name="add-circle" size={20} />
					</TouchableOpacity>
				</View>
			</View>
			{!product.discount ? (
				<TouchableOpacity
					onPress={() => onAddDiscount(product.id)}
					style={invoiceStyles.addDiscountButton}
				>
					<MaterialIcons name="discount" size={16} color="#13ec6a" />
					<Text style={invoiceStyles.addDiscountText}>Add Discount</Text>
				</TouchableOpacity>
			) : (
				<View style={invoiceStyles.discountInfo}>
					<Text style={invoiceStyles.discountText}>
						-{product.discount.value}
						{product.discount.type === "percent" ? "%" : ""} Off
					</Text>
					<TouchableOpacity>
						<Text style={invoiceStyles.editText}>Edit</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}
