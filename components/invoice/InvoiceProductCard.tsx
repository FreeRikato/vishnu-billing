import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import type { InvoiceProduct } from "@/types";
import { basisPointsToPercent, formatCurrency } from "@/utils/currency";

interface InvoiceProductCardProps {
	product: InvoiceProduct;
	onQuantityChange: (id: number, delta: number) => void;
	onRemove: (id: number) => void;
	onAddDiscount: (id: number) => void;
	onEditDiscount: (id: number) => void;
}

export function InvoiceProductCard({
	product,
	onQuantityChange,
	onRemove,
	onAddDiscount,
	onEditDiscount,
}: InvoiceProductCardProps) {
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
					onPress={() => onRemove(product.id)}
					style={invoiceStyles.removeButton}
				>
					<AntDesign name="close-circle" size={20} color="#9ca3af" />
				</TouchableOpacity>
			</View>
			<View style={invoiceStyles.productFooter}>
				<Text style={invoiceStyles.productPrice}>
					{formatCurrency(product.price)}
				</Text>
				<View style={invoiceStyles.stepper}>
					<TouchableOpacity
						onPress={() => onQuantityChange(product.id, -1)}
						style={invoiceStyles.stepperButton}
					>
						<Ionicons name="remove-circle" size={20} color="#ffffff" />
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
				<TouchableOpacity
					style={invoiceStyles.discountInfo}
					onPress={() => onEditDiscount(product.id)}
				>
					<Text style={invoiceStyles.discountText}>
						-
						{product.discount.type === "percent"
							? `${basisPointsToPercent(product.discount.value)}%`
							: formatCurrency(product.discount.value)}{" "}
						Off
					</Text>
					<Text style={invoiceStyles.editText}>Edit</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}
