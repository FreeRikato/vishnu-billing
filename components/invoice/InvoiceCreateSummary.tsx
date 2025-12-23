import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Discount, InvoiceSummary } from "@/types";

interface InvoiceCreateSummaryProps {
	summary: InvoiceSummary;
	globalDiscount?: Discount;
	onAddGlobalDiscount: () => void;
}

export function InvoiceCreateSummary({
	summary,
	globalDiscount,
	onAddGlobalDiscount,
}: InvoiceCreateSummaryProps) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Summary</Text>
			<View style={styles.summaryCard}>
				{/* Subtotal */}
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Subtotal</Text>
					<Text style={styles.summaryValue}>
						${summary.subtotal.toFixed(2)}
					</Text>
				</View>

				{/* Global Invoice Discount (Stacked below subtotal) */}
				{!globalDiscount ? (
					<TouchableOpacity
						onPress={onAddGlobalDiscount}
						style={styles.addDiscountButton}
					>
						<MaterialIcons name="discount" size={16} color="#13ec6a" />
						<Text style={styles.addDiscountText}>Add Discount</Text>
					</TouchableOpacity>
				) : (
					<View style={styles.summaryRow}>
						<TouchableOpacity
							style={styles.discountInfo}
							onPress={onAddGlobalDiscount}
						>
							<Text style={styles.discountText}>
								Discount ({globalDiscount.value}
								{globalDiscount.type === "percent" ? "%" : ""})
							</Text>
							<Text style={styles.editText}>Edit</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Total Savings (Informational) */}
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Total Savings</Text>
					<Text style={styles.summaryValue}>
						-${summary.totalDiscount.toFixed(2)}
					</Text>
				</View>

				{/* Tax */}
				<View style={styles.summaryRow}>
					<Text style={styles.summaryLabel}>Tax (5%)</Text>
					<Text style={styles.summaryValue}>${summary.tax.toFixed(2)}</Text>
				</View>

				<View style={styles.divider} />

				{/* Total */}
				<View style={styles.totalRow}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalValue}>${summary.total.toFixed(2)}</Text>
				</View>
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
	summaryCard: {
		backgroundColor: "#121212",
		borderRadius: 12,
		padding: 20,
		borderWidth: 1,
		borderColor: "#374151",
		gap: 16,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	summaryLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: "#9ca3af",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
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
	summaryValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#ffffff",
	},
	divider: {
		height: 1,
		backgroundColor: "#374151",
		marginVertical: 8,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 4,
	},
	totalValue: {
		fontSize: 36,
		fontWeight: "800",
		color: "#13ec6a",
		letterSpacing: -1,
	},
});
