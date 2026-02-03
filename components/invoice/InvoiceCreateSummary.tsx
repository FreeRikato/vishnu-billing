import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles";
import type { Discount, InvoiceSummary } from "@/types";
import { basisPointsToPercent, formatCurrency, numberToWords } from "@/utils/currency";
import { scale } from "@/utils/responsive";

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
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>Summary</Text>
			<View style={invoiceStyles.summaryCard}>
				{/* Subtotal */}
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>Subtotal</Text>
					<Text style={invoiceStyles.summaryValue}>
						{formatCurrency(summary.subtotal)}
					</Text>
				</View>

				{/* Global Invoice Discount (Stacked below subtotal) */}
				{!globalDiscount ? (
					<TouchableOpacity
						onPress={onAddGlobalDiscount}
						style={invoiceStyles.addDiscountButton}
					>
						<MaterialIcons name="discount" size={scale(16)} color="#13ec6a" />
						<Text style={invoiceStyles.addDiscountText}>Add Discount</Text>
					</TouchableOpacity>
				) : (
					<View style={invoiceStyles.summaryRow}>
						<TouchableOpacity
							style={invoiceStyles.discountInfo}
							onPress={onAddGlobalDiscount}
						>
							<Text style={invoiceStyles.discountText}>
								Discount (
								{globalDiscount.type === "percent"
									? `${basisPointsToPercent(globalDiscount.value)}%`
									: formatCurrency(globalDiscount.value)}
								)
							</Text>
							<Text style={invoiceStyles.editText}>Edit</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Total Savings (Informational) */}
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>Total Savings</Text>
					<Text style={invoiceStyles.summaryValue}>
						-{formatCurrency(summary.totalDiscount)}
					</Text>
				</View>

				{/* Tax */}
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>Tax (5%)</Text>
					<Text style={invoiceStyles.summaryValue}>
						{formatCurrency(summary.tax)}
					</Text>
				</View>

				<View style={invoiceStyles.divider} />

				{/* Total */}
				<View style={invoiceStyles.totalRow}>
					<Text style={invoiceStyles.totalLabel}>Total</Text>
					<Text style={invoiceStyles.totalValue}>
						{formatCurrency(summary.total)}
					</Text>
				</View>
			</View>
		</View>
	);
}
