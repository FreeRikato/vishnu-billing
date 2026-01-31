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
	colorScheme: "light" | "dark";
}

// Create styles function
const createInvoiceItemStyles = (isDark: boolean) =>
	StyleSheet.create({
		invoiceItem: {
			flexDirection: "row" as const,
			alignItems: "flex-start" as const,
			gap: scale(16),
			padding: scale(20),
			marginBottom: scale(16),
			borderRadius: scale(24),
			backgroundColor: isDark ? "#161b18" : "#ffffff",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 2,
			borderWidth: 1,
			borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
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
			borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "#d1d5db",
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
			color: isDark ? "#ffffff" : "#1f2937",
			flex: 1,
		},
		amount: {
			fontSize: moderateScale(20),
			fontWeight: "700" as const,
		},
		amountPaid: {
			color: isDark ? "#13ec6a" : "#059669",
		},
		amountPartial: {
			color: isDark ? "#ffd700" : "#ca8a04",
		},
		amountUnpaid: {
			color: isDark ? "#ef4444" : "#dc2626",
		},
		invoiceDetails: {
			gap: scale(2),
		},
		detailText: {
			fontSize: moderateScale(14),
			color: isDark ? "#9ca3af" : "#6b7280",
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
	colorScheme,
}: InvoiceItemProps) {
	const isDark = colorScheme === "dark";
	const styles = createInvoiceItemStyles(isDark);

	return (
		<TouchableOpacity
			style={styles.invoiceItem}
			onLongPress={onLongPress}
			onPress={selectionMode && onToggle ? () => onToggle(item.id) : onPress}
			delayLongPress={300}
		>
			{selectionMode && (
				<View style={styles.checkboxWrapper}>
					<TouchableOpacity
						style={[styles.checkbox, item.checked && styles.checkboxChecked]}
						onPress={() => onToggle?.(item.id)}
					>
						{item.checked && (
							<Ionicons name="checkmark" style={styles.checkIcon} />
						)}
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.invoiceContent}>
				<View style={styles.invoiceHeader}>
					<Text style={styles.customerName} numberOfLines={1}>
						{item.customerName}
					</Text>
					<Text
						style={[
							styles.amount,
							item.status === "paid" && styles.amountPaid,
							item.status === "partial" && styles.amountPartial,
							item.status === "unpaid" && styles.amountUnpaid,
						]}
					>
						{item.amount}
					</Text>
				</View>
				<View style={styles.invoiceDetails}>
					<Text style={styles.detailText}>{item.invoiceNumber}</Text>
					<Text style={styles.detailText}>{item.date}</Text>
					<Text style={styles.detailText}>Total: {item.total}</Text>
				</View>
				<View
					style={[
						styles.statusBadge,
						item.status === "paid"
							? styles.statusBadgePaid
							: item.status === "partial"
								? styles.statusBadgePartial
								: styles.statusBadgeUnpaid,
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
							styles.statusText,
							item.status === "paid"
								? styles.statusTextPaid
								: item.status === "partial"
									? styles.statusTextPartial
									: styles.statusTextUnpaid,
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
