import { StyleSheet, Text, View } from "react-native";
import type { InvoiceWithItems } from "@/types/invoice";

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

	return (
		<View style={cardStyles.container}>
			{/* Paper Content */}
			<View style={cardStyles.paper}>
				{/* Header */}
				<View style={cardStyles.header}>
					<View style={cardStyles.headerLeft}>
						<Text style={cardStyles.invoiceTitle}>Invoice</Text>
						<Text style={cardStyles.invoiceNumber}>
							#{invoice.invoiceNumber}
						</Text>
					</View>
					<View style={cardStyles.logo}>
						<Text style={cardStyles.logoText}>V</Text>
					</View>
				</View>

				{/* Bill To Section */}
				<View style={cardStyles.billToSection}>
					<View style={cardStyles.billToLeft}>
						<Text style={cardStyles.sectionLabel}>Billed To</Text>
						<Text style={cardStyles.customerName}>{invoice.customerName}</Text>
						<Text style={cardStyles.customerPhone}>
							{invoice.customerPhone}
						</Text>
					</View>
					<View style={cardStyles.billToRight}>
						<Text style={cardStyles.sectionLabel}>Date Issued</Text>
						<Text style={cardStyles.dateText}>{formatDate(invoice.date)}</Text>
						<Text style={[cardStyles.sectionLabel, cardStyles.mt2]}>Total</Text>
						<Text style={cardStyles.totalAmount}>
							${invoice.total.toFixed(2)}
						</Text>
					</View>
				</View>

				{/* Line Items */}
				<View style={cardStyles.itemsSection}>
					<View style={cardStyles.tableHeader}>
						<Text style={cardStyles.tableHeaderLabel}>Description</Text>
						<Text style={[cardStyles.tableHeaderLabel, cardStyles.textRight]}>
							Amount
						</Text>
					</View>
					{invoice.items.map(
						(item: InvoiceWithItems["items"][number], index: number) => {
							const lineTotal = (item.price * item.quantity).toFixed(2);
							const isLast = index === invoice.items.length - 1;

							return (
								<View
									key={item.id}
									style={[
										cardStyles.tableRow,
										!isLast && cardStyles.borderBottom,
									]}
								>
									<View style={cardStyles.itemDetails}>
										<Text style={cardStyles.itemName}>{item.name}</Text>
										<Text style={cardStyles.itemMeta}>
											{item.quantity} x {item.description} @ $
											{item.price.toFixed(2)}
										</Text>
										{item.discount && (
											<Text style={cardStyles.discountText}>
												Discount: -{item.discount.value}
												{item.discount.type === "percent" ? "%" : ""}
											</Text>
										)}
									</View>
									<Text style={[cardStyles.itemAmount, cardStyles.textRight]}>
										${lineTotal}
									</Text>
								</View>
							);
						},
					)}
				</View>

				{/* Summary Section */}
				<View style={cardStyles.summarySection}>
					<View style={cardStyles.summaryRow}>
						<Text style={cardStyles.summaryLabel}>Subtotal</Text>
						<Text style={cardStyles.summaryValue}>
							${invoice.subtotal.toFixed(2)}
						</Text>
					</View>
					<View style={cardStyles.summaryRow}>
						<Text style={cardStyles.summaryLabel}>Discount</Text>
						<Text style={[cardStyles.summaryValue, cardStyles.discountValue]}>
							-${invoice.totalDiscount.toFixed(2)}
						</Text>
					</View>
					<View style={cardStyles.summaryRow}>
						<Text style={cardStyles.summaryLabel}>Tax (5%)</Text>
						<Text style={cardStyles.summaryValue}>
							${invoice.tax.toFixed(2)}
						</Text>
					</View>
					<View style={[cardStyles.summaryRow, cardStyles.totalRow]}>
						<Text style={cardStyles.totalLabel}>Total Due</Text>
						<Text style={cardStyles.totalValue}>
							${invoice.total.toFixed(2)}
						</Text>
					</View>
				</View>

				{/* Footer */}
				<View style={cardStyles.footer}>
					<Text style={cardStyles.footerText}>
						Thank you for your business!
					</Text>
					<Text style={cardStyles.footerSubtext}>
						Vishnu Billing • Generated on {formatDate(invoice.date)}
					</Text>
				</View>
			</View>
		</View>
	);
}

const cardStyles = StyleSheet.create({
	container: {
		width: 360,
		backgroundColor: "#ffffff",
	},
	paper: {
		padding: 32,
		backgroundColor: "#ffffff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingBottom: 16,
		borderBottomWidth: 2,
		borderBottomColor: "#1e293b",
		marginBottom: 24,
	},
	headerLeft: {
		flexDirection: "column",
	},
	invoiceTitle: {
		fontSize: 28,
		fontWeight: "900",
		textTransform: "uppercase",
		letterSpacing: -0.5,
		color: "#1e293b",
	},
	invoiceNumber: {
		fontSize: 16,
		fontWeight: "600",
		color: "#64748b",
		marginTop: 4,
	},
	logo: {
		width: 48,
		height: 48,
		backgroundColor: "#1e293b",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	logoText: {
		fontSize: 24,
		fontWeight: "700",
		color: "#ffffff",
	},
	billToSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 32,
	},
	billToLeft: {
		flex: 1,
	},
	billToRight: {
		alignItems: "flex-end",
	},
	sectionLabel: {
		fontSize: 12,
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		color: "#94a3b8",
		marginBottom: 4,
	},
	customerName: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
		lineHeight: 20,
	},
	customerPhone: {
		fontSize: 14,
		color: "#64748b",
		marginTop: 4,
	},
	dateText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
	},
	mt2: {
		marginTop: 12,
	},
	totalAmount: {
		fontSize: 20,
		fontWeight: "900",
		color: "#1e293b",
	},
	itemsSection: {
		flex: 1,
		marginBottom: 24,
	},
	tableHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	tableHeaderLabel: {
		fontSize: 12,
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		color: "#94a3b8",
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 16,
	},
	borderBottom: {
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	itemDetails: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 4,
	},
	itemMeta: {
		fontSize: 13,
		color: "#64748b",
		marginBottom: 2,
	},
	discount: {
		marginTop: 4,
	},
	discountText: {
		fontSize: 12,
		color: "#13ec6a",
		fontWeight: "600",
	},
	itemAmount: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
	},
	textRight: {
		textAlign: "right",
	},
	summarySection: {
		borderTopWidth: 2,
		borderTopColor: "#1e293b",
		paddingTop: 20,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	summaryLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#64748b",
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
	},
	discountValue: {
		color: "#ef4444",
	},
	totalRow: {
		marginTop: 8,
		marginBottom: 0,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1e293b",
	},
	totalValue: {
		fontSize: 32,
		fontWeight: "900",
		color: "#1e293b",
		letterSpacing: -1,
	},
	footer: {
		marginTop: 24,
		paddingTop: 24,
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		alignItems: "center",
	},
	footerText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1e293b",
	},
	footerSubtext: {
		fontSize: 12,
		color: "#94a3b8",
		marginTop: 4,
	},
});
