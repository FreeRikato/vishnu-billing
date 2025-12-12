import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { Product } from "@/types";
import { productsStyles } from "../styles/products";

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
					${product.price.toFixed(2)}
				</Text>
				{onEdit && (
					<TouchableOpacity
						style={productsStyles.editButton}
						onPress={(e) => {
							e.stopPropagation();
							onEdit(product);
						}}
					>
						<MaterialIcons name="edit" size={28} color="#13EC6A" />
					</TouchableOpacity>
				)}
				<MaterialIcons name="chevron-right" size={24} color="#666" />
			</View>
		</TouchableOpacity>
	);
}
