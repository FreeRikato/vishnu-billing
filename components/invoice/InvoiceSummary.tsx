import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles/invoice";
import type { InvoiceSummary as InvoiceSummaryType } from "@/types/invoice";
import { formatCurrency } from "@/utils/currency";

interface InvoiceSummaryProps {
	summary: InvoiceSummaryType;
}

export function InvoiceSummary({ summary }: InvoiceSummaryProps) {
	return (
		<View style={invoiceStyles.section}>
			<Text style={invoiceStyles.sectionTitle}>Summary</Text>
			<View style={invoiceStyles.summaryCard}>
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>Subtotal</Text>
					<Text style={invoiceStyles.summaryValue}>
						{formatCurrency(summary.subtotal)}
					</Text>
				</View>
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>
						Discount
						<TouchableOpacity style={invoiceStyles.addDiscountBadge}>
							<Text style={invoiceStyles.addDiscountBadgeText}>Add</Text>
						</TouchableOpacity>
					</Text>
					<Text style={invoiceStyles.summaryValue}>
						-{formatCurrency(summary.totalDiscount)}
					</Text>
				</View>
				<View style={invoiceStyles.summaryRow}>
					<Text style={invoiceStyles.summaryLabel}>Tax (5%)</Text>
					<Text style={invoiceStyles.summaryValue}>
						{formatCurrency(summary.tax)}
					</Text>
				</View>
				<View style={invoiceStyles.divider} />
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
