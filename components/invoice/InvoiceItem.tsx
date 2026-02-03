import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Invoice } from "@/types";
import { moderateScale, scale } from "@/utils/responsive";

interface InvoiceItemProps {
	item: Invoice;
	onToggle?: (id: string) => void;
	onLongPress?: () => void;
	onPress?: () => void;
	selectionMode: boolean;
}

// Static styles for dark theme only
const invoiceItemStyles = StyleSheet.create({
	invoiceItem: {
		flexDirection: "row" as const,
		alignItems: "flex-start" as const,
		gap: scale(16),
		padding: scale(20),
		marginBottom: scale(16),
		borderRadius: scale(24),
		backgroundColor: "#161b18",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.05)",
	},
	checkboxWrapper: {
		marginLeft: scale(-8),
		padding: scale(4),
		opacity: 1,
	},
	checkbox: {
		width: scale(32),
		height: scale(32),
		borderRadius: scale(16),
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
		backgroundColor: "transparent",
		justifyContent: "center" as const,
		alignItems: "center" as const,
	},
	checkboxChecked: {
		backgroundColor: "#13ec6a",
		borderColor: "#13ec6a",
	},
	checkIcon: {
		color: "#000000",
		fontSize: moderateScale(20),
	},
	invoiceContent: {
		flex: 1,
		gap: scale(4),
	},
	invoiceHeader: {
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "flex-start" as const,
	},
	customerName: {
		fontSize: moderateScale(20),
		fontWeight: "700" as const,
		color: "#ffffff",
		flex: 1,
	},
	amount: {
		fontSize: moderateScale(20),
		fontWeight: "700" as const,
	},
	amountPaid: {
		color: "#13ec6a",
	},
	amountPartial: {
		color: "#ffd700",
	},
	amountUnpaid: {
		color: "#ef4444",
	},
	invoiceDetails: {
		gap: scale(2),
	},
	detailText: {
		fontSize: moderateScale(14),
		color: "#9ca3af",
		fontWeight: "500" as const,
	},
	statusBadge: {
		alignSelf: "flex-start" as const,
		marginTop: scale(8),
		flexDirection: "row" as const,
		alignItems: "center" as const,
		gap: scale(6),
		paddingHorizontal: scale(12),
		paddingVertical: scale(4),
		borderRadius: scale(12),
	},
	statusBadgePaid: {
		backgroundColor: "rgba(19, 236, 106, 0.2)",
	},
	statusBadgePartial: {
		backgroundColor: "rgba(255, 215, 0, 0.2)",
	},
	statusBadgeUnpaid: {
		backgroundColor: "rgba(239, 68, 68, 0.2)",
	},
	statusText: {
		fontSize: moderateScale(12),
		fontWeight: "700" as const,
		textTransform: "uppercase" as const,
		letterSpacing: 0.5,
	},
	statusTextPaid: {
		color: "#13ec6a",
	},
	statusTextPartial: {
		color: "#ffd700",
	},
	statusTextUnpaid: {
		color: "#ef4444",
	},
});

function InvoiceItem({
	item,
	onToggle,
	onLongPress,
	onPress,
	selectionMode,
}: InvoiceItemProps) {
	return (
		<TouchableOpacity
			style={invoiceItemStyles.invoiceItem}
			onLongPress={onLongPress}
			onPress={selectionMode && onToggle ? () => onToggle(item.id) : onPress}
			delayLongPress={300}
		>
			{selectionMode && (
				<View style={invoiceItemStyles.checkboxWrapper}>
					<TouchableOpacity
						style={[
							invoiceItemStyles.checkbox,
							item.checked && invoiceItemStyles.checkboxChecked,
						]}
						onPress={() => onToggle?.(item.id)}
					>
						{item.checked && (
							<Ionicons name="checkmark" style={invoiceItemStyles.checkIcon} />
						)}
					</TouchableOpacity>
				</View>
			)}
			<View style={invoiceItemStyles.invoiceContent}>
				<View style={invoiceItemStyles.invoiceHeader}>
					<Text style={invoiceItemStyles.customerName} numberOfLines={1}>
						{item.customerName}
					</Text>
					<Text
						style={[
							invoiceItemStyles.amount,
							item.status === "paid" && invoiceItemStyles.amountPaid,
							item.status === "partial" && invoiceItemStyles.amountPartial,
							item.status === "unpaid" && invoiceItemStyles.amountUnpaid,
						]}
					>
						{item.amount}
					</Text>
				</View>
				<View style={invoiceItemStyles.invoiceDetails}>
					<Text style={invoiceItemStyles.detailText}>{item.invoiceNumber}</Text>
					<Text style={invoiceItemStyles.detailText}>{item.date}</Text>
					<Text style={invoiceItemStyles.detailText}>Total: {item.total}</Text>
				</View>
				<View
					style={[
						invoiceItemStyles.statusBadge,
						item.status === "paid"
							? invoiceItemStyles.statusBadgePaid
							: item.status === "partial"
								? invoiceItemStyles.statusBadgePartial
								: invoiceItemStyles.statusBadgeUnpaid,
					]}
				>
					<Ionicons
						name={
							item.status === "paid"
								? "checkmark-circle"
								: item.status === "partial"
									? "remove-circle"
									: "close-circle"
						}
						size={scale(14)}
						color={
							item.status === "paid"
								? "#13ec6a"
								: item.status === "partial"
									? "#ffd700"
									: "#ef4444"
						}
					/>
					<Text
						style={[
							invoiceItemStyles.statusText,
							item.status === "paid"
								? invoiceItemStyles.statusTextPaid
								: item.status === "partial"
									? invoiceItemStyles.statusTextPartial
									: invoiceItemStyles.statusTextUnpaid,
						]}
					>
						{item.status === "paid"
							? "Paid"
							: item.status === "partial"
								? "Partial"
								: "Unpaid"}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default InvoiceItem;
