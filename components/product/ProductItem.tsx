import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { productsStyles } from "@/styles/products";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { scale } from "@/utils/responsive";

interface ProductItemProps {
	product: Product;
	onPress?: (product: Product) => void;
	onEdit?: (product: Product) => void;
}

export default function ProductItem({
	product,
	onPress,
	onEdit,
}: ProductItemProps) {
	return (
		<TouchableOpacity
			style={productsStyles.productItem}
			activeOpacity={0.7}
			onPress={() => onPress?.(product)}
		>
			<View style={productsStyles.productInfo}>
				<View style={productsStyles.productNameContainer}>
					<Text style={productsStyles.productName}>{product.name}</Text>
				</View>
				<Text style={productsStyles.productUnit}>{product.unit}</Text>
			</View>
			<View style={productsStyles.productRight}>
				<Text style={productsStyles.productPrice}>
					{formatCurrency(product.price)}
				</Text>
				{onEdit && (
					<TouchableOpacity
						onPress={(e) => {
							e.stopPropagation();
							onEdit(product);
						}}
					>
						<MaterialIcons name="chevron-right" size={scale(24)} color="#666" />
					</TouchableOpacity>
				)}
				{!onEdit && (
					<MaterialIcons name="chevron-right" size={scale(24)} color="#666" />
				)}
			</View>
		</TouchableOpacity>
	);
}
