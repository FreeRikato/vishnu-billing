import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { InvoiceProduct } from "@/types";

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
		<View style={styles.productCard}>
			<View style={styles.productHeader}>
				<View style={styles.productInfo}>
					<Text style={styles.productName}>{product.name}</Text>
					<Text style={styles.productDescription}>{product.description}</Text>
				</View>
				<TouchableOpacity
					onPress={() => onRemove(product.id)}
					style={styles.removeButton}
				>
					<AntDesign name="close-circle" size={20} color="#9ca3af" />
				</TouchableOpacity>
			</View>
			<View style={styles.productFooter}>
				<Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
				<View style={styles.stepper}>
					<TouchableOpacity
						onPress={() => onQuantityChange(product.id, -1)}
						style={styles.stepperButton}
					>
						<Ionicons name="remove-circle" size={20} color="#ffffff" />
					</TouchableOpacity>
					<Text style={styles.stepperValue}>{product.quantity}</Text>
					<TouchableOpacity
						onPress={() => onQuantityChange(product.id, 1)}
						style={styles.stepperButtonPrimary}
					>
						<Ionicons name="add-circle" size={20} />
					</TouchableOpacity>
				</View>
			</View>
			{!product.discount ? (
				<TouchableOpacity
					onPress={() => onAddDiscount(product.id)}
					style={styles.addDiscountButton}
				>
					<MaterialIcons name="discount" size={16} color="#13ec6a" />
					<Text style={styles.addDiscountText}>Add Discount</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={styles.discountInfo}
					onPress={() => onEditDiscount(product.id)}
				>
					<Text style={styles.discountText}>
						-{product.discount.value}
						{product.discount.type === "percent" ? "%" : ""} Off
					</Text>
					<Text style={styles.editText}>Edit</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	productCard: {
		backgroundColor: "#121212",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#374151",
		gap: 16,
	},
	productHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
	},
	productDescription: {
		fontSize: 14,
		color: "#9ca3af",
		marginTop: 2,
	},
	removeButton: {
		padding: 4,
		marginLeft: -4,
	},
	productFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 4,
	},
	productPrice: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
	},
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#000000",
		borderRadius: 8,
		padding: 4,
		gap: 16,
		borderWidth: 1,
		borderColor: "#374151",
	},
	stepperButton: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#1E1E1E",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	stepperButtonPrimary: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#13ec6a",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 3,
	},
	stepperValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		minWidth: 24,
		textAlign: "center",
	},
	addDiscountButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		alignSelf: "flex-start",
		marginTop: 4,
	},
	addDiscountText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#13ec6a",
		textDecorationLine: "underline",
	},
	discountInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		fontSize: 14,
		color: "#9ca3af",
	},
	discountText: {
		color: "#13ec6a",
		fontWeight: "700",
	},
	editText: {
		textDecorationLine: "underline",
		fontSize: 12,
	},
});
