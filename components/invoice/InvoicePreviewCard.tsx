import { FlatList, Text, View } from "react-native";
import { invoiceStyles } from "@/styles";
import type { InvoiceWithItems } from "@/types/invoice";
import { basisPointsToPercent, paiseToDecimal } from "@/utils/currency";

interface InvoicePreviewCardProps {
	invoice: InvoiceWithItems;
}

export function InvoicePreviewCard({ invoice }: InvoicePreviewCardProps) {
	// Calculate formatted date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// Render item for FlatList
	const renderItem = ({
		item,
		index,
	}: {
		item: InvoiceWithItems["items"][number];
		index: number;
	}) => {
		const lineTotal = (paiseToDecimal(item.price) * item.quantity).toFixed(2);
		const isLast = index === invoice.items.length - 1;

		return (
			<View
				style={[invoiceStyles.tableRow, !isLast && invoiceStyles.borderBottom]}
			>
				<View style={invoiceStyles.itemDetails}>
					<Text style={invoiceStyles.itemName}>{item.name}</Text>
					<Text style={invoiceStyles.itemMeta}>
						{item.quantity} x {item.description} @ ₹
						{paiseToDecimal(item.price).toFixed(2)}
					</Text>
					{item.discount && (
						<Text style={invoiceStyles.previewCardDiscountText}>
							Discount: -
							{item.discount.type === "percent"
								? `${basisPointsToPercent(item.discount.value)}%`
								: `₹${paiseToDecimal(item.discount.value).toFixed(2)}`}
						</Text>
					)}
				</View>
				<Text style={[invoiceStyles.itemAmount, invoiceStyles.textRight]}>
					₹{lineTotal}
				</Text>
			</View>
		);
	};

	const keyExtractor = (
		item: InvoiceWithItems["items"][number],
		index: number,
	) => item.id || `item-${index}`;

	const getItemLayout = (_data: unknown, index: number) => ({
		length: 80, // Approximate height of each item
		offset: 80 * index,
		index,
	});

	return (
		<View style={invoiceStyles.container}>
			{/* Paper Content */}
			<View style={invoiceStyles.paper}>
				{/* Header */}
				<View style={invoiceStyles.header}>
					<View style={invoiceStyles.headerLeft}>
						<Text style={invoiceStyles.invoiceTitle}>Invoice</Text>
						<Text style={invoiceStyles.invoiceNumber}>
							#{invoice.invoiceNumber}
						</Text>
					</View>
					<View style={invoiceStyles.logo}>
						<Text style={invoiceStyles.logoText}>V</Text>
					</View>
				</View>

				{/* Bill To Section */}
				<View style={invoiceStyles.billToSection}>
					<View style={invoiceStyles.billToLeft}>
						<Text style={invoiceStyles.sectionLabel}>Billed To</Text>
						<Text style={invoiceStyles.previewCardCustomerName}>
							{invoice.customerName}
						</Text>
						<Text style={invoiceStyles.customerPhone}>
							{invoice.customerPhone}
						</Text>
						{invoice.customerAddress && (
							<Text style={invoiceStyles.customerDetail}>
								{invoice.customerAddress}
							</Text>
						)}
						{invoice.customerGstin && (
							<Text style={invoiceStyles.customerDetail}>
								GSTIN: {invoice.customerGstin}
							</Text>
						)}
						{invoice.customerDlNo && (
							<Text style={invoiceStyles.customerDetail}>
								DL No: {invoice.customerDlNo}
							</Text>
						)}
					</View>
					<View style={invoiceStyles.billToRight}>
						<Text style={invoiceStyles.sectionLabel}>Date Issued</Text>
						<Text style={invoiceStyles.dateText}>
							{formatDate(invoice.date)}
						</Text>
						<Text style={[invoiceStyles.sectionLabel, invoiceStyles.mt2]}>
							Total
						</Text>
						<Text style={invoiceStyles.totalAmount}>
							₹{paiseToDecimal(invoice.total).toFixed(2)}
						</Text>
					</View>
				</View>

				{/* Line Items */}
				<View style={invoiceStyles.itemsSection}>
					<View style={invoiceStyles.tableHeader}>
						<Text style={invoiceStyles.tableHeaderLabel}>Description</Text>
						<Text
							style={[invoiceStyles.tableHeaderLabel, invoiceStyles.textRight]}
						>
							Amount
						</Text>
					</View>
					<FlatList
						data={invoice.items}
						renderItem={renderItem}
						keyExtractor={keyExtractor}
						getItemLayout={getItemLayout}
						scrollEnabled={false}
					/>
				</View>

				{/* Summary Section */}
				<View style={invoiceStyles.summarySection}>
					<View style={invoiceStyles.summaryRow}>
						<Text style={invoiceStyles.summaryLabel}>Subtotal</Text>
						<Text style={invoiceStyles.previewCardSummaryValue}>
							₹{paiseToDecimal(invoice.subtotal).toFixed(2)}
						</Text>
					</View>
					<View style={invoiceStyles.summaryRow}>
						<Text style={invoiceStyles.summaryLabel}>Discount</Text>
						<Text
							style={[
								invoiceStyles.previewCardSummaryValue,
								invoiceStyles.discountValue,
							]}
						>
							-₹{paiseToDecimal(invoice.totalDiscount).toFixed(2)}
						</Text>
					</View>
					<View style={invoiceStyles.summaryRow}>
						<Text style={invoiceStyles.summaryLabel}>Tax (5%)</Text>
						<Text style={invoiceStyles.previewCardSummaryValue}>
							₹{paiseToDecimal(invoice.tax).toFixed(2)}
						</Text>
					</View>
					<View style={[invoiceStyles.summaryRow, invoiceStyles.totalRow]}>
						<Text style={invoiceStyles.totalLabel}>Total Due</Text>
						<Text style={invoiceStyles.totalValue}>
							₹{paiseToDecimal(invoice.total).toFixed(2)}
						</Text>
					</View>
				</View>

				{/* Footer */}
				<View style={invoiceStyles.previewCardFooter}>
					<Text style={invoiceStyles.previewCardFooterText}>
						Thank you for your business!
					</Text>
					<Text style={invoiceStyles.previewCardFooterSubtext}>
						Vishnu Billing • Generated on {formatDate(invoice.date)}
					</Text>
				</View>
			</View>
		</View>
	);
}
