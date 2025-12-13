import { Text, TouchableOpacity, View } from "react-native";
import { invoiceStyles } from "@/styles/invoice";
import type { InvoiceSummary as InvoiceSummaryType } from "@/types/invoice";

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
          <Text style={invoiceStyles.summaryValue}>${summary.subtotal.toFixed(2)}</Text>
        </View>
        <View style={invoiceStyles.summaryRow}>
          <Text style={invoiceStyles.summaryLabel}>
            Discount
            <TouchableOpacity style={invoiceStyles.addDiscountBadge}>
              <Text style={invoiceStyles.addDiscountBadgeText}>Add</Text>
            </TouchableOpacity>
          </Text>
          <Text style={invoiceStyles.summaryValue}>-${summary.totalDiscount.toFixed(2)}</Text>
        </View>
        <View style={invoiceStyles.summaryRow}>
          <Text style={invoiceStyles.summaryLabel}>Tax (5%)</Text>
          <Text style={invoiceStyles.summaryValue}>${summary.tax.toFixed(2)}</Text>
        </View>
        <View style={invoiceStyles.divider} />
        <View style={invoiceStyles.totalRow}>
          <Text style={invoiceStyles.totalLabel}>Total</Text>
          <Text style={invoiceStyles.totalValue}>${summary.total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}